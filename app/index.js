'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
// var yosay = require('yosay');
var slug = require('slug');
var latest = require('latest-version');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var request = require('request');
var tar = require('tar');
var zlib = require('zlib');
var rimraf = require('rimraf');

var config = {
  paths: {
    src: 'src/',
    dist: 'dist/',
    mamp: '/Applications/MAMP/htdocs/'
  },
  url: {
    wp: 'https://wordpress.org/latest.tar.gz',
    theme: 'https://github.com/nichoth/sc-wp-theme/tarball/master'
  }
};

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();
    var self = this;

    // Have Yeoman greet the user.
//    this.log(yosay(
//      'Welcome to the stellar ' + chalk.red('npm') + ' generator!'
//    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'Project name: ',
      default: this.appname
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description: '
    },
    {
      type: 'checkbox',
      name: 'npmDeps',
      message: 'Other stuff',
      choices: [{
        name: 'flexslider',
        value: 'flexslider',
        checked: false
      }]
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies?',
      default: true
    },
    {
      type: 'confirm',
      name: 'mampDir',
      message: 'Create MAMP directory and install WP?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.description = props.description;
      this.appNameSlug = slug(props.appName);
      this.mampPath = config.paths.mamp+this.appNameSlug+'/';
      this.devDeps = ['uglify-js'];
      this.installDeps = props.installDeps;
      this.mampDir = props.mampDir;
      this.bowerDeps = ['sc-sass'];
      this.npmDeps = props.npmDeps;
      this.depVersions = {};

      function devDeps(cb) {
        async.each(self.devDeps, getVersion, function(err) {
          if (err) {
            self.skipVersions = true;
            console.log(chalk.red('Fetching dependency versions failed.'));
          }
          cb();
        });
      }

      function getVersion(item, callback) {
        latest(item, function(err, version) {
          self.depVersions[item] = '^'+version;
          callback(err);
        });
      }

      var asyncTasks = [];
      asyncTasks.push(devDeps);
      async.parallel(asyncTasks, function() {
        done();
      });

    }.bind(this));
  },


  writing: function () {
    var done = this.async();
    var self = this;

    // download wp
    function wp(cb) {
      var path = self.mampPath;
      mkdirp.sync(path);
      var extractor = tar.Extract({ path: path, strip: 1 });
      request.get(config.url.wp)
        .pipe(zlib.createGunzip())
        .pipe(extractor)
      ;
      extractor.on('end', cleanup);

      function cleanup() {
        async.parallel([
          function(cb) {
            rimraf(self.mampPath+'wp-content/themes/*', cb);
          },
          plugins
        ], function() {
          cb();
        });
      }
    }

    function plugins(cb) {
      rimraf(self.mampPath+'wp-content/plugins', function() {
        self.directory(self.templatePath('plugins'),
          self.mampPath+'wp-content/plugins'
        );
        cb();
      });
    }

    // write template files
    function write() {
      this.directory(
        this.templatePath('src'),
        this.destinationPath('src')
      );
      mkdirp.sync(this.destinationPath('dist/images'));
      mkdirp.sync(this.destinationPath('dist/js'));
      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_main.js'),
        this.destinationPath('src/js/main.js'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this
      );
      this.fs.copy(
        this.templatePath('_editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copyTpl(
        this.templatePath('_main.scss'),
        this.destinationPath('src/style/main.scss'),
        this
      );
    }
    write.bind(self)();

    var asyncTasks = [];
    if (this.mampDir) { asyncTasks.push(wp); }

    async.parallel(asyncTasks, function() {
      if (self.mampDir) {  // create symlink and copy plugins
        fs.symlink(
          self.destinationPath(config.paths.src),
          self.mampPath+'wp-content/themes/'+self.appNameSlug,
          function() {
            plugins(done);
          }
        );
      } else {
        done();
      }
    });
  },

  install: function () {
    if (this.installDeps) {
      console.log(chalk.yellow('Installing npm and bower dependencies.'));
      this.npmInstall(this.devDeps, {'saveDev': true});
      this.npmInstall(this.npmDeps, {'save': true});
      this.bowerInstall(this.bowerDeps, {'save': true});
    }
  },

  end: function() {
    if (this.installDeps) {
    }
  }

});

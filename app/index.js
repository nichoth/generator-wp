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

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.pkg = require('../package.json');
    this.config = {
      paths: {
        style: 'site/style',
        wp: 'site/wp'
      }
    };
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
    // {
    //   type: 'checkbox',
    //   name: 'devDeps',
    //   message: 'Other stuff',
    //   choices: [{
    //     name: 'react',
    //     value: 'react',
    //     checked: false
    //   }]
    // },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies?',
      default: true
    },
    {
      type: 'confirm',
      name: 'mampDir',
      message: 'Create MAMP directory?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.description = props.description;
      this.appNameSlug = slug(props.appName);
      this.mampPath = '/Applications/MAMP/htdocs/'+this.appNameSlug+'/';
      this.devDeps = ['livereload'];
      this.installDeps = props.installDeps;
      this.mampDir = props.mampDir;
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
      request.get('https://wordpress.org/latest.tar.gz')
        .pipe(zlib.createGunzip())
        .pipe(extractor)
      ;
      extractor.on('end', cleanup);

      function cleanup() {
        async.parallel([
          function(cb) {
            rimraf(self.mampPath+'wp-content/themes', cb);
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

    // download theme
    function scTheme(cb) {
      var path = self.destinationPath();
      var extractor = tar.Extract({ path: path, strip: 1 });
      request.get('https://github.com/nichoth/sc-wp-theme/tarball/master')
        .pipe(zlib.createGunzip())
        .pipe(extractor)
      ;
      extractor.on('end', function() {
        cb();
      });
    }

    function write() {
      rimraf.sync(this.destinationPath('readme.md'));
      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        this
      );
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
    }

    var asyncTasks = [scTheme];
    if (this.mampDir) { asyncTasks.push(wp); }

    async.parallel(asyncTasks, function() {
      write.bind(self)();
      if (self.mampDir) {
        mkdirp.sync(self.mampPath+'wp-content/themes');
        fs.symlink(
          self.destinationPath('public'),
          self.mampPath+'wp-content/themes/sc',
          function() {
            done();
          }
        );
      } else {
        done();
      }
    });
  },

  install: function () {
    if (this.installDeps) {
      this.installDependencies();
    }
  },

  end: function() {
    if (this.installDeps) {
      fs.createReadStream(
        this.destinationPath(
          'bower_components/flexslider/jquery.flexslider-min.js'
      )).pipe(fs.createWriteStream(
          this.destinationPath('js/jquery.flexslider-min.js')
      ));
    }
  }

});

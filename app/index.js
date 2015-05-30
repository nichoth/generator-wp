'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
// var yosay = require('yosay');
var slug = require('slug');
var latest = require('latest-version');
var async = require('async');
var fs = require('fs');
var mkdirp = require('mkdirp');
var http = require('http');
var tar = require('tar');
var zlib = require('zlib');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.mampPath = '/Applications/MAMP/htdocs';
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
      this.devDeps = ['parallelshell', 'livereload'];
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


  writing: {
    app: function () {

      // easier without template
      var pkg = require('./templates/_package.json');
      pkg.name = this.appNameSlug;
      pkg.description = this.description;
      pkg.repository.url = pkg.repository.url+
        '/'+this.appNameSlug+'.git'
      ;
      if (!this.installDeps && !this.skipVersions) {
        pkg.devDependencies = this.depVersions;
      }
      fs.writeFile(
        this.destinationPath('package.json'),
        JSON.stringify(pkg, null, 2)
      );

      var bower = require('./templates/_bower.json');
      bower.name = this.appNameSlug;
      fs.writeFile(
        this.destinationPath('bower.json'),
        JSON.stringify(bower, null, 2)
      );

      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        this
      );
      this.fs.copyTpl(
        this.templatePath(this.config.paths.style+'/style.scss'),
        this.destinationPath(this.config.paths.style+'/style.scss'),
        this
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('site/wp/themes/sc/*.*'),
        this.destinationPath(this.config.paths.wp+'/'+'themes/sc/')
      );
      this.fs.copy(
        this.templatePath('site/index.php'),
        this.destinationPath('site/index.php')
      );
      this.fs.copy(
        this.templatePath('site/themes/index.php'),
        this.destinationPath('site/themes/index.php')
      );
      this.fs.copy(
        this.templatePath(this.config.paths.style+'/_*.scss'),
        this.destinationPath(this.config.paths.style)
      );
      mkdirp.sync(
        this.destinationPath(this.config.paths.style+'/'+this.appNameSlug)
      );
      fs.writeFileSync(this.destinationPath(
        this.config.paths.style+'/'+
        this.appNameSlug+'/_'+this.appNameSlug+'.scss'
      ));

      fs.mkdirSync(this.destinationPath('dist'));
      mkdirp.sync(this.destinationPath('site/wp/themes/sc/fonts'));
      mkdirp.sync(this.destinationPath('site/wp/themes/sc/js'));
    }
  },

  install: function () {
    if (this.installDeps) {
      this.npmInstall(this.devDeps, {saveDev: true});
      this.bowerInstall();
    }

    // download wp and install
    if (this.mampDir) {
      var path = this.mampPath+'/'+this.appNameSlug;
      mkdirp.sync(path);
      http.get(
        'https://wordpress.org/latest.tar.gz',
        function(resp) {
          resp
            .pipe(zlib.createGunzip())
            .pipe(tar.Extract({ path: path })
          );
        }
      );
    }
  }
});

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
// var yosay = require('yosay');
var slug = require('slug');
var npmconf = require('npmconf');
var latest = require('latest-version');
var async = require('async');
var fs = require('fs');

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
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.description = props.description;
      this.appNameSlug = slug(props.appName);
      this.devDeps = props.devDeps.concat(props.devServer, 'parallelshell');
      this.includeServer = props.devServer.length > 0;
      this.installDeps = props.installDeps;
      this.transforms = [];
      if (props.devDeps.indexOf('react') > -1) {
        this.devDeps.push('reactify');
        this.transforms.push('reactify');
      }
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

      function conf(cb) {
        npmconf.load({}, function(err, conf) {
          self.authorName = conf.get('init.author.name');
          self.authorEmail = conf.get('init.author.email');
          self.github = conf.get('init.author.github');
          cb();
        });
      }

      function getVersion(item, callback) {
        latest(item, function(err, version) {
          self.depVersions[item] = '^'+version;
          callback(err);
        });
      }

      var asyncTasks = [conf];
      if (!this.installDeps) asyncTasks.push(devDeps);

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
      pkg.main = this.mainFile;
      pkg.browserify.transform = this.transforms;
      pkg.author = this.authorName + ' <' + this.authorEmail+'>';
      pkg.repository.url = pkg.repository.url+
        this.github+
        '/'+this.appNameSlug+'.git'
      ;
      if (this.includeServer) {
        pkg.scripts.server = 'node server.js';
      } else {
        delete pkg.scripts.server;
      }
      if (!this.installDeps && !this.skipVersions) {
        pkg.devDependencies = this.depVersions;
      }
      fs.writeFile(
        this.destinationPath('package.json'),
        JSON.stringify(pkg, null, 2)
      );

      this.fs.copyTpl(
        this.templatePath('example/_index.html'),
        this.destinationPath('example/index.html'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('example/_example.js'),
        this.destinationPath('example/example.js'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_readme.md'),
        this.destinationPath('readme.md'),
        this
      );
      if (this.includeServer) {
        this.fs.copyTpl(
          this.templatePath('_server.js'),
          this.destinationPath('server.js'),
          this
        );
      }
      this.fs.copyTpl(
        this.templatePath('_index.js'),
        this.destinationPath(this.mainFile),
        this
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    }
  },

  install: function () {
    if (this.installDeps) {
      this.npmInstall(this.devDeps, {saveDev: true});
    }
  }
});

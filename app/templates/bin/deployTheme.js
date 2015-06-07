var fs = require('vinyl-fs');
var ftp = require('vinyl-ftp');
var config = require('../ftp.json');

var remotePath = config.wpPath+'/'+config.themePath;
var localPath = [
  './dist/**/*'
];

var c = new ftp({
  host: config.host,
  user: config.user,
  password: config.password,
  log: console.log
});

fs.src( localPath, {buffer: false} )
  .pipe(c.dest(remotePath));



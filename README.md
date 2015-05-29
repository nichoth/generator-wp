# npm Module Generator #

Generator for consumable npm modules, using browserify and `npm run` scripts as a build process.

## Install ##

```bash
$ git clone https://github.com/nichoth/generator-npm.git
$ cd generator-npm
$ npm link
```

## Use ##

```bash
$ cd my-project && yo npm
```

Depends on npm init settings for author name, email, and github. Set them like this if they are not already:

```
$ npm config set init.author.name your name
$ npm config set init.author.email your email
$ npm config set init.author.github github handle
```

## Example Output

```
├── example/
│   ├── example.js
│   └── index.html
├── index.js
├── package.json
├── readme.md
└── server.js
```

package.json:

```json
{
  "name": "bla",
  "description": "blablabla",
  "main": "index.js",
  "version": "0.0.0",
  "browserify": {
    "transform": []
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "browserify -d example/example.js > example/bundle.js",
    "watch": "watchify example/example.js -o example/bundle.js -dv",
    "dev": "parallelshell \"npm run watch\" parallelshell \"npm run server\"",
    "server": "node server.js",
    "demo": "browserify example/example.js > example/bundle.js && html-inline example/index.html | curl -sT- https://htmlb.in"
  },
  "author": "...",
  "repository": {
    "type": "git",
    "url": "https://github.com/nichoth/bla.git"
  },
  "license": "ISC",
  "peerDependencies": {},
  "devDependencies": {
    "parallelshell": "^1.1.1",
    "ecstatic": "^0.8.0"
  }
}
```

# snapjerk

> snapjerk loves media devices

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

## Usage

snapjerk is meant to be used with [spacebro](https://github.com/spacebro/spacebro).

It listen and emits the following events:

* receive: `record '{"type": "image|video|GIF", "id": 12345}'`
* emits: `record-ended '{ "id": 12345, "filepath": "/path/to/record.ext" }'`
* receive: `new-session`
* receive: `end-session`

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
# -t (or --target=) option is optionnal and override the default webpack target (https://webpack.github.io/docs/configuration.html#target)
npm start [-- -t {target}] # or `npm run dev`

# launch electron and open a window at localhost:8080
# you must have run the `npm run dev` command in an other terminal window
# -s option is optionnal is used to add settings over the default settings
npm run electron [-- -s {settings}]

# build for production with minifications and package the app.
npm run build
npm run build:darwin
npm run build:linux
npm run build:win32
npm run build:all # All platforms, all architectures
npm run build:no-package # Standalone build
# Note: use the -t (or --target=) option to override the default webpack target (https://webpack.github.io/docs/configuration.html#target). For example `npm run build -- -t web`.

# package a portable binary for a specific platform from the available build.
npm run package # package for you current platform
npm run package:darwin
npm run package:linux
npm run package:win32
npm run package:all # All platforms, all architectures
```

For detailed explanation on how things work, checkout the [guide](http://soixantecircuits.github.io/nd/).

:wq

# snapjerk

> A node tool to take snaps from a webcam.

[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

## Build Setup

``` bash
# install dependencies
npm install

# run
# -t (or --target=) option is optionnal and override the default webpack target (https://webpack.github.io/docs/configuration.html#target)
npm start [-- -t {target}] # or `npm run dev`

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

For detailed explanation on how things work with neodymium, the stack used by snapjerk, checkout the [guide](http://soixantecircuits.github.io/nd/).

## Settings

### Usage

By default, `settings/default.json` is used.
If you need a special setting, for example to select a camera, you can load the app with

```
./releases/snapjerk-linux-x64/snapjerk -- -s settings/settings1.json
```

This works only with a packaged app for now. We are working on having this work with `npm start`.

Applied settings via the commandline extends the default settings.
If a setting exists in settings1.json, it will be used.
If a setting is not present in settings1.json, it will use the default one in default.json.

### Select a camera

You can select a camera by its linux path

```
"cameraPath": "/dev/video1",
```

or by its kernels, which is the physical usb port identifier.
This is useful if you have several instances of snapjerk running, each with the same model of camera.

```
  "cameraKernels": "1-1.3",
```

To know the kernels of your camera, run

```
udevadm info --name=/dev/video0 --attribute-walk | grep KERNELS
```


### Camera numbering

In an array of many cameras, messages would all look the same in spacebro.
If you need a numbering, you can use

```
  "cameraNumber": 3,
```

for camera number 3.

In array of many computers, you may want to base the numbering on the computer's name, you can add a number at the end of the computer's hostname and use the setting as follow

```
  "cameraNumber": "$hostname+5",
```

The number of the computer should be at the end of the hostname.
If the computer's hostname is `mycomputer3`, `thiscomputer-03`, the resulting camera number would be 8.

## Camera settings

A list of settings is available from any camera: autoexposure, autofocus, saturation, sharpness, ...
In the future, they will me available in snapjerk.
For now, you can use

1. guvcview: to tweak the settings
2. uvcdynctrl: to save and load settings

```
# save
/usr/bin/uvcdynctrl -W webcam_settings.gpfl --device video0
# load
/usr/bin/uvcdynctrl -L webcam_settings.gpfl --device video0
```

Some webcams lose settings on disconnect. To load settings at startup, edit a cron with `crontab -e` and add

```
@reboot sleep 15; /usr/bin/uvcdynctrl -L /path/to/webcam_settings.gpfl
```


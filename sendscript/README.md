# usbcam-serverjs
An application to configure and take pictures with a Webcam

this (linux) app server relies on fswebcam:
`sudo apt-get install fswebcam`

fswebcam works fine with: 
- Logitech Webcam C920

fswebcam is actually unstable with: 
- Logitech Webcam C930e

# launching with default configuration

`node app.js -s settings.json`

then go to http://localhost:3000/snap to trigger action !

You can launch multiple app snapjerk server app w/ different configuration files ! 
running spacebro could be a great idea too !

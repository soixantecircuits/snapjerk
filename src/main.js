import 'gsap'

import Vue from 'vue'
import router from './router'
import './transitions'
import settings from 'src/lib/settings.js'
const fs = require('fs')
const path = require('path');

const App = Vue.extend({})

// - webcam initialization

const webcam = require('webcamjs')

webcam.on( 'load', function() {
  console.log('library is loaded')
})

webcam.on( 'live', function() {
  console.log('camera is live, showing preview image (and user has allowed access)')
})

webcam.on( 'error', function(err) {
  console.log('an error occurred ', err)
})
webcam.set(settings.cameraOptions)

listDevices()

function listDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.")
    return
  }

  navigator.mediaDevices.enumerateDevices()
  .then((devices) => {
    devices.forEach((device) => {
      // console.log(device.kind + ": " + device.label + " id = " + device.deviceId)
      console.log("list devices: ", device)
    })
  })
  .catch((err) => {
    console.log(err.name + ": " + err.message)
  })
}

// - spacebro initialization

var snap = function (data, callback) {
		webcam.snap((dataURL) => {
        data.dataURL = dataURL
				let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
				let filename = data.shortId + '-' + settings.flux + '.jpg'
				let file = path.join(settings.imageFolder, filename)
				console.log('file:', file)
				fs.writeFile(file, base64Data, 'base64', function(err) {
					if (err !== null) {
						console.log(err)
						typeof callback === 'function' && callback(err, data)
					} else {
						let msg = {
							src: 'http://' + path.join(settings.server.host + ':' + settings.server.port, filename),
							number: settings.flux,
							album_name: data.shortId || Math.random()*10000
						}
						spacebroClient.emit('image-saved', msg)
					}
				})
				typeof callback === 'function' && callback(null, data)
			})
}
var spacebroClient = require('spacebro-client')
var actionList = [
  {
    name: 'shoot',
    trigger: function (data) {
      console.log('shoot: ', data)
			snap(data)
    }
  },
  {
    name: 'image-saved',
    trigger: function (data) {
      console.log('image-saved received: ', data)
    }
  }
]
spacebroClient.iKnowMyMaster(settings.spacebro.server.address, settings.spacebro.server.port)
spacebroClient.registerToMaster(actionList, settings.spacebro.computer)

export default {
  snap: snap
}
// - static server

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
var serve = serveStatic(settings.imageFolder)

// Create server
var server = http.createServer(function (req, res) {
  console.log('create server cb', req, res)
  var done = finalhandler(req, res)
  serve(req, res, done)
})

server.listen(settings.server.port)

// - go  

router.start(App, 'body')


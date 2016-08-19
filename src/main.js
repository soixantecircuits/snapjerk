import 'gsap'

import Vue from 'vue'
import router from './router'
import './transitions'

import settings from 'src/lib/settings.js'
import camUtils from 'src/lib/camUtils.js'
import sbc from 'src/lib/spacebro-client.js'

const getPort = require('get-port')

const App = Vue.extend({})

// - spacebro client

sbc.init()

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
if (settings.server.port > 0 ) {
  server.listen(settings.server.port)
} else {
  getPort().then(port => {
    settings.server.port = port
    server.listen(port)
  });
}

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

camUtils.listDevices()
camUtils.getDevicesMap(onDeviceMapCreated)

function onDeviceMapCreated(err, res) {
  // console.log(res, err, settings.device, res[settings.device])
  if (res[settings.device]) {
    let id = res[settings.device]
    console.log('select device id :', id)
    let cameraOptions 
    cameraOptions = Object.assign({}, settings.cameraOptions)
    cameraOptions.constraints.optional = [{
      "sourceId": id
    }]
    webcam.set(cameraOptions)
  } else {
    console.error('there is no flux for : ', settings.device)
  }

  // - go  

  router.start(App, 'body')
}



import 'gsap'

import Vue from 'vue'
import router from './router'
import './transitions'
import settings from 'src/lib/settings.js'

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

const portconfig = settings.starport
const starport = require('starport').default

starport.connect({
  server: {
    address: portconfig.server.address,
    port: portconfig.server.port
  },
  computer: portconfig.computer,
  channel: portconfig.channel,
  packers: [{ handler: data => console.log('=>', data) }],
  unpackers: [{ handler: data => console.log('<=', data) }]
})

// - go  

router.start(App, 'body')

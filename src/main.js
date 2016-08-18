import 'gsap'

import Vue from 'vue'
import router from './router'
import './transitions'
import settings from 'src/lib/settings.js'

const App = Vue.extend({})

const webcam = require('webcamjs')
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
      console.log(device.kind + ": " + device.label +
                  " id = " + device.deviceId)
    })
  })
  .catch((err) => {
    console.log(err.name + ": " + err.message)
  })
}

router.start(App, 'body')

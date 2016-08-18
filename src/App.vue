<template>
  <div id="app">
    <button type='button' @click='takeSnap'>
      <span>SNAP</span>
    </button>
    <!--select id="audioSelect"></select-->
    <!--select id="videoSelect"></select-->
    <div id="live_canvas">LIVE CAMERA</div>
    <img id="still_frame" v-bind:src="getDataUrl">
  </div>
</template>

<script>
import store from 'src/vuex/store'
import {getDataUrl} from 'src/vuex/getters'
import {takeSnap} from 'src/vuex/actions'

console.log('app.vue')

const webcam = require('webcamjs')
const starport = require('starport').default

export default {
  name: 'App',
  store,
  vuex: {
    getters: {
      getDataUrl
    },
    actions: {
      takeSnap
    }
  },/*
  methods: {
    select(id) {
      let cameraOptions 
      cameraOptions = Object.assign({}, settings.cameraOptions)
      cameraOptions.constraints.optional = [{
        "sourceId": id
      }]
      webcam.set(cameraOptions)
      webcam.attach( '#live_canvas' )
    }
  },*/
  ready() {
    webcam.attach( '#live_canvas' )

    starport.on('snap', (data) => {
      console.log('starport::snap', data)
      this.takeSnap(data)
    })

    /*
    let audioSelect = document.getElementById('audioSelect')
    let videoSelect = document.getElementById('videoSelect')

    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          var option = document.createElement('option');
          option.value = device.deviceId;
          if (device.kind === 'audioinput') {
            option.text = device.label || 'microphone ' + (audioSelect.length + 1);
            audioSelect.appendChild(option);
          } else if (device.kind === 'videoinput') {
            option.text = device.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
          } else {
            console.log('Some other kind of source: ', device);
          }
        })
      })
      .catch((err) => {
        console.log(err.name + ": " + err.message)
      })

    let vm = this

    videoSelect.addEventListener("change", function() {
      console.log(videoSelect.value)
      vm.select(videoSelect.value)
    });*/
  }
}
</script>

<style>

/* reset css */
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

html {
  height: 100%;
}

body {
  display: flex;
  /* align-items: center; */
  /* justify-content: center; */
  height: 100%;
}

button {
  z-index: 1;
  position: fixed;
  top: 10px;
  left: 10px;
}

</style>

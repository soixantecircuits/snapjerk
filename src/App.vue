<template>
  <div id="app">
    <button type='button' @click='takeSnap'>
      <span>SNAP</span>
    </button>
    <div id="live_canvas">LIVE CAMERA</div>
    <img id="still_frame" v-bind:src="getDataUrl">
    <!--
    <div id="live_wrapper">
      <div id="live_canvas">LIVE CAMERA</div>
    </div>
    <div id="still_wrapper">
      <img id="still_frame">
    </div>
    -->
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
  },
  ready() {
    webcam.attach( '#live_canvas' )

    starport.on('snap', () => {
      console.log('starport::snap')
      this.takeSnap()
    })
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

/*
#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
  position: relative;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

#app > div {
  background: #EEE;
  position: absolute;
  width: 100%;
}

.logo {
  width: 100px;
  height: 100px
}*/
</style>

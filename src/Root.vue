<template>
  <div class="root">
    <h1>snapjerk</h1>
    <video autoplay muted></video>
  </div>
</template>

<script>
'use strict'

const settings = require('electron').remote.getGlobal('settings')
const camera = require('./lib/camera')

export default {
  data() {
    return {
      stream: null
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'camready' && mutation.payload === true) {
        document.querySelector('video').srcObject = camera.getStream()
      }
    })
    camera.init(this)
  }
}
</script>
<style src="./assets/styles/main.scss"></style>
<style scoped>
video {
  width: 100vw;
  height: 100vh;
}
</style>

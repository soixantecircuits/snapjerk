<template>
  <div class="root">
    <h1>snapjerk</h1>
    <button @click="record" :disabled="recording">record</button>
    <video id="preview" autoplay muted></video>
  </div>
</template>

<script>
'use strict'

const settings = require('electron').remote.getGlobal('settings')
const camera = require('./lib/camera')
const { mapState } = require('vuex')

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState([ 'camready', 'recording' ])
  },
  methods: {
    record () {
      this.$store.commit('recording', true)
      camera.record()
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'camready' && mutation.payload === true) {
        document.querySelector('#preview').srcObject = camera.getStream()
      }
    })
    camera.init({
      recording: settings.recording,
      devices: settings.devices
    }, () => { // onStreamAvailable
        this.$store.commit('camready', true)
    }, (blobURL, blob, dataURL) => { // onRecordEnded
      this.$store.commit('recording', false)
    })
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

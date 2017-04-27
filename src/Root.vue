<template>
  <div class="root">
    <h1>snapjerk</h1>
    <button @click="record('image')" :disabled="recording">record image</button>
    <button @click="record('video')" :disabled="recording">record video</button>
    <button @click="record('GIF')" :disabled="recording">record GIF</button>
    <video id="preview" autoplay muted></video>
  </div>
</template>

<script>
'use strict'

const settings = require('electron').remote.getGlobal('settings')
const camera = require('./lib/camera')
const { mapState } = require('vuex')
const spacebroClient = require('spacebro-client')

spacebroClient.connect(settings.service.spacebro.host, settings.service.spacebro.port,
  {
    clientName: settings.service.spacebro.client,
    channelName: settings.service.spacebro.channel
  }
)

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState([ 'camready', 'recording' ])
  },
  methods: {
    record (type, id=Date.now()) {
      this.$store.commit('recording', true)
      camera.record(type, id)
    }
  },
  mounted() {
    spacebroClient.on('record', (raw) => {
      try {
        const { type, id } = JSON.parse(raw)
        this.record(type, id)
      } catch (e) {
        console.warn(e)
      }
    })
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'camready' && mutation.payload === true) {
        const video = document.querySelector('#preview')
        video.width = settings.devices.video.width
        video.height = settings.devices.video.height
        video.srcObject = camera.getStream()
      }
    })
    camera.init(() => { // onStreamAvailable
      this.$store.commit('camready', true)
    }, (id) => { // onRecordEnded
      this.$store.commit('recording', false)
      spacebroClient.emit('record-ended', { id })
    })
  },
  destroy() {
    spacebroClient.off('record', this.record)
  }
}
</script>
<style src="./assets/styles/main.scss"></style>
<style scoped>
/*
 *
 */
</style>

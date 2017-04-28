<template>
  <div class="root">
    <div class="overlay" @click="removeOverlay"></div>
    <div class="recorder" @click="setOverlay">
      <div class="controls">
        <button @click.stop="record('image')" :disabled="recording">🖼</button>
        <button @click.stop="record('video')" :disabled="recording">🎥</button>
        <button @click.stop="record('GIF')" :disabled="recording">🎞</button>
      </div>
      <video id="preview" autoplay muted></video>
    </div>
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
    },
    setOverlay () {
      TweenMax.to('.recorder', 0.8, {
        opacity: 0,
        top: 1080,
        ease: Power2.easeIn
      })
      TweenMax.to('.overlay', 0.8, {
        opacity: 1,
        top: 0,
        delay: 0.05,
        ease: Power2.easeOut
      })
    },
    removeOverlay () {
      TweenMax.to('.overlay', 0.8, {
        opacity: 0,
        top: -1080,
        ease: Power2.easeIn
      })
      TweenMax.to('.recorder', 0.8, {
        opacity: 1,
        top: 0,
        delay: 0.05,
        ease: Power2.easeOut
      })
    }
  },
  mounted() {
    this.setOverlay()
    spacebroClient.on('new-session', this.removeOverlay)
    spacebroClient.on('end-session', this.setOverlay)
    spacebroClient.on('record', (raw) => {
      try {
        const { type, id } = typeof(raw) === 'object'
          ? raw
          : JSON.parse(raw)
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
    }, (id, filepath) => { // onRecordEnded
      this.$store.commit('recording', false)
      spacebroClient.emit('record-ended', { id, filepath })
    })
  },
  destroy() {
    spacebroClient.off('record', this.record)
  }
}
</script>
<style src="./assets/styles/main.scss"></style>
<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: url(./assets/images/snapjerk.jpg) center no-repeat;
  background-size: cover;
}
.recorder {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
}
.controls {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6;
  margin: 2em auto;
  text-align: center;
  button {
    font-size: 2em;
    padding: 1em;
    margin: 0 1em;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 50%;
    transition: all .3s ease;
    &:hover, &:active {
      opacity: 0.5;
    }
  }
}
</style>

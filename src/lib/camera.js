'use strict'

const _ = require('lodash')
const getUserMedia = require('getUserMedia')
const RecordRTC = require('recordrtc')

let stream = null
let recorder = null

function init (options, onStreamAvailable, onRecordEnded) {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => devices.filter(device => {
    const kind = device.kind.replace(/input/i, '')
    const label = options.devices[kind] ? options.devices[kind].label : null
    return new RegExp(label, 'i').test(device.label)
  }))
  .then(devices => {
    const videoDeviceIndex = _.findIndex(devices, { kind: 'videoinput' })
    const videoID = devices[videoDeviceIndex].deviceId
    console.info('Acquiring video from', devices[videoDeviceIndex].label)
    const audioDeviceIndex = _.findIndex(devices, { kind: 'audioinput' })
    const audioID = devices[audioDeviceIndex].deviceId
    console.info('Acquiring audio from', devices[audioDeviceIndex].label)
    getUserMedia({
      video: {
        deviceId: {
          exact: videoID
        },
        width: options.devices.video.width,
        height: options.devices.video.height
      },
      audio: {
        deviceId: {
          exact: audioID
        }
      }
    }, (err, mediastream) => {
      if (err) {
        console.log(err)
      } else {
        stream = mediastream

        recorder = RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/mp4',
          frameInterval: (1000 / options.recording.fps)
        })

        recorder
          .setRecordingDuration(options.recording.duration * 1000)
          .onRecordingStopped(blobURL => {
            const blob = recorder.getBlob()
            const dataURL = recorder.getDataURL(dataURL => dataURL)
            typeof onRecordEnded === 'function' && onRecordEnded(blobURL, blob, dataURL)
          })

        typeof onStreamAvailable === 'function' && onStreamAvailable()
      }
    })
  })
}

function record () {
  recorder.startRecording()
}

module.exports = {
  init,
  record,
  getStream: () => stream
}

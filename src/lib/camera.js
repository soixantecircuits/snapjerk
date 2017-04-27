'use strict'

const _ = require('lodash')
const getUserMedia = require('getUserMedia')
const RecordRTC = require('recordrtc')

const settings = require('electron').remote.getGlobal('settings')

let stream = null
let imagerecorder = { shoot: () => {} }
let videorecorder = null
let GIFrecorder = null

let currentID = 0

function init (onStreamAvailable, onRecordEnded) {
  navigator.mediaDevices.enumerateDevices()
  .then(devices => devices.filter(device => {
    const kind = device.kind.replace(/input/i, '')
    const label = settings.devices[kind] ? settings.devices[kind].label : null
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
        width: settings.devices.video.width,
        height: settings.devices.video.height
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

        const onStop = function (id, blob, type, callback) {
          const ext = type === 'video'
            ? 'webm'
            : type === 'GIF'
              ? 'gif'
              : 'png'
          const filepath = `/tmp/${id}.${ext}`
          const reader = new window.FileReader()
          reader.readAsArrayBuffer(blob)
          reader.addEventListener('load', () => {
            const mediaBuffer = new Buffer(reader.result)
            require('fs').writeFile(filepath, mediaBuffer, (err) => {
              if (err) {
                throw err
              } else {
                typeof callback === 'function' && callback(currentID, filepath)
                console.log(filepath)
              }
            })
          }, false)
        }

        imagerecorder.shoot = () => {
          const video = document.querySelector('#preview')
          try {
            const canvas = document.createElement('canvas')
            canvas.width = settings.devices.video.width
            canvas.height = settings.devices.video.height
            document.body.appendChild(canvas)
            canvas.style.display = 'none'
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            setTimeout(() => {
              canvas.toBlob((blob) => {
                onStop(currentID, blob, 'image', onRecordEnded)
                canvas.remove()
              }, 'image/png', 0.95)
            }, 0)
          } catch (e) {
          }
        }

        videorecorder = RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/mp4',
          frameInterval: (1000 / settings.recording.fps)
        })
        videorecorder
          .setRecordingDuration(settings.recording.duration * 1000)
          .onRecordingStopped(blobURL => {
            const blob = videorecorder.getBlob()
            onStop(currentID, blob, 'video', onRecordEnded)
          })

        GIFrecorder = RecordRTC(stream, {
          type: 'gif',
          frameRate: settings.recording.framerateGIF
        })
        GIFrecorder
          .setRecordingDuration(settings.recording.durationGIF * 1000)
          .onRecordingStopped(blobURL => {
            const blob = GIFrecorder.getBlob()
            onStop(currentID, blob, 'GIF', onRecordEnded)
          })

        typeof onStreamAvailable === 'function' && onStreamAvailable()
      }
    })
  })
}

function record (type, id) {
  console.log(`recording ${type} with ${id}`)
  if (id !== currentID) {
    currentID = id
    type === 'image' && imagerecorder.shoot()
    type === 'video' && videorecorder.startRecording()
    type === 'GIF' && GIFrecorder.startRecording()
  } else {
    console.log(`record with id ${id} seem to already exists. Skipping.`)
  }
}

function clear () {
  videorecorder.clearRecordedData()
}

module.exports = {
  init,
  record,
  clear,
  getStream: () => stream
}

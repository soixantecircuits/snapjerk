'use strict'

const _ = require('lodash')
const getUserMedia = require('getUserMedia')

let stream = null

function init (options, cb) {
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
        typeof cb === 'function' && cb()
      }
    })
  })
}

module.exports = {
  init,
  getStream: () => stream
}

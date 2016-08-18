const webcam = require('webcamjs')
const fs = require('fs')

import settings from './../lib/settings.js'
const starport = require('starport').default

export const takeSnap = function ({ dispatch, state }, data) {
  dispatch('ASK_TAKE_SNAP')

  console.log('datas: ', data.shortId)

  webcam.snap((dataURL) => {
    
    dispatch('ANS_TAKE_SNAP', dataURL)

    let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
    let file = settings.imageFolder + data.shortId + '-' + settings.flux + '.' + settings.cameraOptions.image_format
    console.log('file:', file)
    fs.writeFile(file, base64Data, 'base64', function(err) {
      if (err !== null) {
        console.log(err)
      } else {
        let msg = {
          src: 'mystaticserver:port/' + file,
          index: settings.flux,
          album: data.shortId
        }
        starport.emit('image-saved', msg)
      }
    })
  })
}

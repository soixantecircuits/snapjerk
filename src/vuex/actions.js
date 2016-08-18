const webcam = require('webcamjs')
const fs = require('fs')
const path = require('path')
const os = require("os")

import settings from './../lib/settings.js'
const starport = require('starport').default

export const takeSnap = function ({ dispatch, state }, data) {
  dispatch('ASK_TAKE_SNAP')

  console.log('datas: ', data.shortId)

  webcam.snap((dataURL) => {
    
    dispatch('ANS_TAKE_SNAP', dataURL)

    let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
    let filename = os.hostname() + '-' + data.shortId + '-' + settings.flux + '.jpg'
    let file = path.join(settings.imageFolder, filename)
    console.log('file:', file)
    fs.writeFile(file, base64Data, 'base64', function(err) {
      if (err !== null) {
        console.log(err)
      } else {
        let msg = {
          src: 'http://' + path.join(settings.server.host + ':' + settings.server.port, filename),
          index: settings.flux,
          album_name: data.shortId
        }
        starport.emit('image-saved', msg)
      }
    })
  })
}

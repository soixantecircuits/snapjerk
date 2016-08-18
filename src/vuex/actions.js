const webcam = require('webcamjs')
const fs = require('fs')

import settings from './../lib/settings.js'

export const takeSnap = function ({ dispatch, state }) {
  dispatch('ASK_TAKE_SNAP')

  webcam.snap((dataURL) => {
    
    dispatch('ANS_TAKE_SNAP', dataURL)

    let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
    fs.writeFile(settings.file, base64Data, 'base64', function(err) {
      console.log(err)
    })
  })
}

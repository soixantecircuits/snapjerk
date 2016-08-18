const webcam = require('webcamjs')
const fs = require('fs')

export const takeSnap = function ({ dispatch, state }) {
  dispatch('ASK_TAKE_SNAP')

  webcam.snap((dataURL) => {
    
    dispatch('ANS_TAKE_SNAP', dataURL)

    let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
    fs.writeFile("/tmp/out.jpg", base64Data, 'base64', function(err) {
      console.log(err)
    })
  })
}

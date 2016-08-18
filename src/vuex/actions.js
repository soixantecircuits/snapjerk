const webcam   = require('webcamjs')

export const takeSnap = function ({ dispatch, state }) {
  dispatch('ASK_TAKE_SNAP')
  webcam.snap((dataURL) => {
    dispatch('ANS_TAKE_SNAP', dataURL)
  })
}

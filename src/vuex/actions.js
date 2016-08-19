const webcam = require('webcamjs')
const fs = require('fs')
const path = require('path');


import settings from './../lib/settings.js'
import main from './../main.js'

export const takeSnap = function ({ dispatch, state }, data) {
  dispatch('ASK_TAKE_SNAP')

  console.log('datas: ', data.shortId)

  main.snap(data, function(err, data) {
    dispatch('ANS_TAKE_SNAP', data.dataURL)
  })
}

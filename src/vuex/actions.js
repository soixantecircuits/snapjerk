const webcam = require('webcamjs')
const fs = require('fs')
const path = require('path')
const os = require("os")

import settings from './../lib/settings.js'
import bro from './../lib/spacebro-client.js'

export const takeSnap = function ({ dispatch, state }, data) {
  dispatch('ASK_TAKE_SNAP')

  console.log('datas: ', data.shortId)

  bro.snap(data, function(err, data) {
    dispatch('ANS_TAKE_SNAP', data.dataURL)
  })
}

'use strict'


const settings = require('./settings.json')
const shortid = require('shortid');

//
// -- Spacebro
// >> brodcasting

const config = settings.starport
var spacebroClient = require('spacebro-client')
var actionList = [
  {
    name: 'shoot',
    trigger: function (data) {
      console.log('shoot: ', data)
    }
  }
]
spacebroClient.iKnowMyMaster(config.server.address, config.server.port)
spacebroClient.registerToMaster(actionList, config.computer)

setInterval(function () {
  let id = shortid.generate()
  spacebroClient.emit('shoot', {shortId: id})
}, 2000)

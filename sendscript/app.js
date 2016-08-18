'use strict'


const settings = require('./settings.json')
const shortid = require('shortid');

//
// -- Spacebro
// >> brodcasting

const config = settings.starport
const starport = require('starport').default

starport.connect({
  server: {
    address: config.server.address,
    port: config.server.port
  },
  computer: config.computer,
  channel: config.channel,
  packers: [{ handler: data => console.log('=>', data) }],
  unpackers: [{ handler: data => console.log('<=', data) }]
})

setInterval(function () {
  let id = shortid.generate()
  starport.emit('snap', {shortId: id})
}, 2000)

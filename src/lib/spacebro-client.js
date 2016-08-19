var spacebroClient = require('spacebro-client')
const fs = require('fs')
const path = require('path')
const os = require("os")
const ip = require("ip")
import settings from 'src/lib/settings.js'
const webcam = require('webcamjs')


var snap = function (data, callback) {
	webcam.snap((dataURL) => {
    data.dataURL = dataURL
		let base64Data = dataURL.replace(/^data:image\/jpeg;base64,/, "")
		let filename = os.hostname() + '-' + data.shortId + '-' + settings.cameraNumber + '.jpg'
		let file = path.join(settings.imageFolder, filename)
		console.log('file:', file)
		fs.writeFile(file, base64Data, 'base64', function(err) {
			if (err !== null) {
				console.log(err)
				typeof callback === 'function' && callback(err, data)
			} else {
        if (settings.server.host == "") settings.server.host = undefined 
        let host = (settings.server.host || ip.address())
				let msg = {
					src: 'http://' + path.join( host  + ':' + settings.server.port, filename),
					number: settings.cameraNumber,
					album_name: data.shortId || Math.random()*10000
				}
				spacebroClient.emit('image-saved', msg)
			}
		})
		typeof callback === 'function' && callback(null, data)
	})
}

var actionList = [
  {
    name: 'shoot',
    trigger: function (data) {
      console.log('shoot: ', data)
			snap(data)
    }
  },
  {
    name: 'image-saved',
    trigger: function (data) {
      console.log('image-saved received: ', data)
    }
  }
]

spacebroClient.iKnowMyMaster(settings.spacebro.server.address, settings.spacebro.server.port)
spacebroClient.registerToMaster(actionList, settings.spacebro.computer)

export default {
  snap: snap
}


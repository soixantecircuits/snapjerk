var spacebroClient = require('spacebro-client')
const fs = require('fs')
const path = require('path')
const os = require("os")
const ip = require("ip")
import settings from 'src/lib/settings.js'
const webcam = require('webcamjs')


// init numbering
if (settings.number === 'undefined' || settings.cameraNumber.indexOf('$hostname') !== -1 ) {

  // get offset  in the form  $hostname+1, $hostname+10
  let offset = 0
  let re = /(\d+)$/i
  let match = settings.cameraNumber.match(re)

  if (match && match[1]) {
    offset = parseInt(match[1])
  }


  // get hostname number in the form myname-01, myname1, ...
  let hostname = os.hostname()
  re = /(\d+)$/i
  match = hostname.match(re)

  if (match && match[1]) {
    settings.cameraNumber = parseInt(match[1])
  } else {
    settings.cameraNumber = 1
  }

  settings.cameraNumber += offset
  console.log("camera number: " + settings.cameraNumber)
}

const snap = function (data, callback) {
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
        console.log ('image-saved', msg)
				spacebroClient.emit('image-saved', msg)
			}
		})
		typeof callback === 'function' && callback(null, data)
	})
}

const actionList = [
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

const init = function () {
  console.log('initialize spacebro')
  spacebroClient.iKnowMyMaster(settings.spacebro.server.address, settings.spacebro.server.port)
  spacebroClient.registerToMaster(actionList, settings.spacebro.computer)
}

export default {
  snap,
  init
}


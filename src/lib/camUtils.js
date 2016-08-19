const exec = require('child_process').exec;

/**
 *
 */
const listDevices = () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.")
    return
  }

  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        // console.log(device.kind + ": " + device.label + " id = " + device.deviceId)
        console.log("list devices: ", device)
      })
    })
    .catch((err) => {
      console.log(err.name + ": " + err.message)
    })
}

const getKernels = (path) => {
    return new Promise(
        function (resolve, reject) {
						exec('udevadm info --name '+ path +  ' --attribute-walk | grep KERNELS', (error, stdout, stderr) => {
							if (error) {
								reject(error); // failure
								return
							}
							//console.log(`udevadm: ${stdout}`)
							
							var re = /KERNELS=="(\d-\d\.?\d?)"/i
							var match = stdout.match(re)
							//console.log("match: " + match)
							if (match && match[1]) {
								typeof callback === 'function' && callback(null, match[1])
								resolve(match[1]); // success
							} else {
								typeof callback === 'function' && callback("KERNELS not found", null)
								reject("KERNELS not found"); // failure
							}
						});
        });
}

/**
 *
 * callack(err, res)
 */
const getDevicesMap = (callback) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("enumerateDevices() not supported.")
    return
  }

  let ids = []

  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        if (device.kind === 'videoinput') {
          ids.unshift(device.deviceId)
        }
      })
      
      let map = []
      let promises = []
      ids.forEach((value, index) => {
        let path = '/dev/video'+index
        promises.push(getKernels(path))
      })
			Promise.all(promises)
				.then((values) => {
					ids.forEach((value, index) => {
						let path = '/dev/video'+index
						map.push( {
							id: value,
							path: path,
							kernels: values[index]
						})
					})
					typeof callback === 'function' && callback(null, map)
				})

    })
    .catch((err) => {
      typeof callback === 'function' && callback(err, null)
    })
}

export default {
  listDevices,
  getDevicesMap
}

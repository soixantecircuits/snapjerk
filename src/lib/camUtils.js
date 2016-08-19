/**
 *
 */
export const listDevices = () => {
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

/**
 *
 * callack(err, res)
 */
export const getDevicesMap = (callback) => {
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

      let map = {}
      ids.forEach((value, index) => {
        map['dev/video'+index] = value
      })
      typeof callback === 'function' && callback(null, map)
    })
    .catch((err) => {
      typeof callback === 'function' && callback(err, null)
    })
}

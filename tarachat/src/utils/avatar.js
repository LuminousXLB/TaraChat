const { ipcRenderer } = require('electron')

export const Avatar = (identity, size = 200) => {
  const requestEventName = 'request.avatar'
  const responseEventName = 'response.avatar'

  return new Promise((resolve, reject) => {
    ipcRenderer.on(responseEventName, (event, arg) => {
      // console.warn(responseEventName, arg)
      if (arg.success) {
        if (arg.arg.identity === identity) {
          // console.log(identity, arg.identity, arg.payload.uri)
          resolve(arg.payload)
        }
      } else {
        reject(arg.payload.error)
      }
    })
    ipcRenderer.send(requestEventName, { identity, size })
  })
}

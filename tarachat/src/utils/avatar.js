const { ipcRenderer } = require('electron')

export const Avatar = (identity, size = 200) => {
  const requestEventName = 'request.avatar'
  const responseEventName = 'response.avatar'

  return new Promise((resolve, reject) => {
    let callback = (event, arg) => {
      // console.warn(responseEventName, arg)
      if (arg.success) {
        if (arg.arg.identity === identity) {
          resolve(arg.payload)
          ipcRenderer.removeListener(responseEventName, callback)
        }
      } else {
        reject(arg.payload.error)
      }
    }

    ipcRenderer.on(responseEventName, callback)
    ipcRenderer.send(requestEventName, { identity, size })
  })
}

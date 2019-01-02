const { ipcRenderer } = require('electron')

export function avatar (identity, size) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once('response.avatar', (event, arg) => {
      if (arg.success) {
        resolve(arg)
      } else {
        reject(arg.error)
      }
    })

    ipcRenderer.send('request.avatar', { identity, size })
  })
}

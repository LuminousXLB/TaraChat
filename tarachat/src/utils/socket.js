const { ipcRenderer } = require('electron')

export function Connect () {
  console.log('Connecting...')

  return new Promise((resolve, reject) => {
    ipcRenderer.once('response.socket.connect', (event, arg) => {
      if (arg.success) {
        resolve(arg)
      } else {
        reject(arg.error)
      }
    })

    ipcRenderer.send('request.socket.connect')
  })
}

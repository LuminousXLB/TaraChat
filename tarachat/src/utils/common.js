const { ipcRenderer } = require('electron')

export default function stdIpcCommunication (
  { requestEventName, responseEventName },
  ipcPayload
) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(responseEventName, (event, arg) => {
      if (arg.success) {
        resolve(arg.payload)
      } else {
        console.error(responseEventName, arg)
        reject(arg.payload.error)
      }
    })

    ipcRenderer.send(requestEventName, ipcPayload)
  })
}

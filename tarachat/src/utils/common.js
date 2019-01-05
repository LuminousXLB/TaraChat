const { ipcRenderer } = require('electron')

export default function ipcCommonClient (
  { requestEventName, responseEventName },
  ipcPayload
) {
  return new Promise((resolve, reject) => {
    ipcRenderer.once(responseEventName, (event, arg) => {
      console.warn(responseEventName, arg)

      if (arg.success) {
        resolve(arg.payload)
      } else {
        reject(arg.payload.error)
      }
    })

    ipcRenderer.send(requestEventName, ipcPayload)
  })
}

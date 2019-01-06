import ipcCommonClient from './common.js'
// const { ipcRenderer } = require('electron')

export const FetchOnlineUsers = () => {
  console.log(__filename, 'FetchOnlineUsers')
  return ipcCommonClient({
    requestEventName: 'request.chat.onlineusers',
    responseEventName: 'response.chat.onlineusers'
  })
}

export const SendMessage = ({ touid, message }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.chat.sendmsg',
      responseEventName: 'response.chat.sendmsg'
    },
    { touid, message }
  )

export const ReceiveMessage = () => {
  //   ipcRenderer.once(responseEventName, (event, arg) => {
  //     console.warn(responseEventName, arg)
  //     if (arg.success) {
  //       resolve(arg.payload)
  //     } else {
  //       reject(arg.payload.error)
  //     }
  //   })
}

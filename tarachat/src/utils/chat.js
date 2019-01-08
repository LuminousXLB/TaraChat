import ipcCommonClient from './common.js'
// import { ipcRenderer } from 'electron'
// import AppLayout from 'layouts/AppLayout.vue'

export const FetchOnlineUsers = () =>
  ipcCommonClient({
    requestEventName: 'request.chat.onlineusers',
    responseEventName: 'response.chat.onlineusers'
  })

export const SendMessage = ({ touid, message, timestamp }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.chat.sendmsg',
      responseEventName: 'response.chat.sendmsg'
    },
    { touid, message, timestamp }
  )

export const SendFile = ({ fromuid, touid }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.chat.sendfile',
      responseEventName: 'response.chat.sendfile'
    },
    { fromuid, touid }
  )

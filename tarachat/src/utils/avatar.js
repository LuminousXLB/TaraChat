// const { ipcRenderer } = require('electron')
import stdIpcCommunication from './common.js'

export const avatar = (identity, size) =>
  stdIpcCommunication(
    {
      requestEventName: 'request.avatar',
      responseEventName: 'response.avatar'
    },
    { identity, size }
  )

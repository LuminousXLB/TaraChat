const { ipcMain } = require('electron')
// const crypto = require('crypto')
const tarasocket = require('./socket')

ipcMain.on('request.chat.sendmsg', (event, arg) => {
  const { toFriend, message } = arg

  tarasocket.once('chat.sendmsg', (success, payload) => {
    event.sender.send('response.chat.sendmsg', {
      success,
      arg,
      payload
    })
  })

  tarasocket.send('chat.sendmsg', {
    toFriend,
    message
  })
})

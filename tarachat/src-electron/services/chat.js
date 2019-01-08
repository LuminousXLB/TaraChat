const { ipcMain } = require('electron')
const crypto = require('crypto')
const socket = require('./socket')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

ipcMain.on('request.chat.onlineusers', (event, arg) => {
  socket.on('r.chat.onlineusers', (success, payload) => {
    event.sender.send('response.chat.onlineusers', {
      success: true,
      arg,
      payload
    })
  })

  socket.emit('q.chat.onlineusers')
})

ipcMain.on('request.chat.sendmsg', (event, arg) => {
  const { touid, message } = arg

  const hash = crypto.createHash('md5')
  hash.update(message)
  const digest = hash.digest('hex')

  const timer = setTimeout(() => {
    event.sender.send('response.chat.sendmsg', {
      success: false,
      arg,
      payload: 'Timeout'
    })
  }, 5000)

  socket.on('r.chat.sendmsg', payload => {
    if (payload.touid === touid && payload.digest === digest) {
      clearTimeout(timer)
      event.sender.send('response.chat.sendmsg', {
        success: true,
        arg,
        payload
      })
    }
  })

  socket.emit('q.chat.sendmsg', { touid, message, digest })
})

socket.on('q.chat.receivemsg', ({ fromuid, message, digest }) => {
  logger.info(fromuid, message)
  socket.emit('r.chat.receivemsg', { fromuid, digest })
})

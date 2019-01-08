const { ipcMain, dialog } = require('electron')
const crypto = require('crypto')
const fs = require('fs')
// const ps = require('progress-stream')
// const ss = require('socket.io-stream')
const path = require('path')
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
  const { touid, message, timestamp } = arg

  const hash = crypto.createHash('md5')
  hash.update(message)
  const digest = hash.digest('hex')

  const timer = setTimeout(() => {
    event.sender.send('response.chat.sendmsg', {
      success: false,
      arg,
      payload: { error: 'Timeout' }
    })
  }, 10000)

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

  socket.emit('q.chat.sendmsg', { touid, message, digest, timestamp })
})

ipcMain.on('request.chat.sendfile', (event, arg) => {
  const [selectedFile] = dialog.showOpenDialog({
    properties: ['openFile']
  })

  fs.stat(selectedFile, (error, stats) => {
    if (error) {
      logger.error('request.chat.sendfile', error)
      event.sender.send('response.chat.sendfile', {
        success: false,
        arg,
        payload: { error: error.message }
      })
    } else {
      logger.error('request.chat.sendfile', stats)
      event.sender.send('response.chat.sendfile', {
        success: true,
        arg,
        payload: {
          filename: path.basename(selectedFile),
          stats
        }
      })
    }
  })

  // const { touid, message, timestamp } = arg
  // const hash = crypto.createHash('md5')
  // hash.update(message)
  // const digest = hash.digest('hex')
  // const timer = setTimeout(() => {
  //   event.sender.send('response.chat.sendmsg', {
  //     success: false,
  //     arg,
  //     payload: { error: 'Timeout' }
  //   })
  // }, 10000)
  // socket.on('r.chat.sendmsg', payload => {
  //   if (payload.touid === touid && payload.digest === digest) {
  //     clearTimeout(timer)
  //     event.sender.send('response.chat.sendmsg', {
  //       success: true,
  //       arg,
  //       payload
  //     })
  //   }
  // })
  // socket.emit('q.chat.sendmsg', { touid, message, digest, timestamp })
})

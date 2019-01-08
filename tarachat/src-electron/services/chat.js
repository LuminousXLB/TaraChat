const { ipcMain, dialog } = require('electron')
const crypto = require('crypto')
const EventEmitter = require('events')
const fs = require('fs')
const ps = require('progress-stream')
const ss = require('socket.io-stream')
const path = require('path')
const socket = require('./socket')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

class FileProgressEventBus extends EventEmitter {}
const fileProgressEventBus = new FileProgressEventBus()
module.exports = fileProgressEventBus

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
  const filePaths = dialog.showOpenDialog({ properties: ['openFile'] }) || []

  if (filePaths.length < 1) {
    const error = 'Canceled when choosing file'
    logger.error('request.chat.sendfile', error)
    event.sender.send('response.chat.sendfile', {
      success: false,
      arg,
      payload: { error }
    })
    return
  }

  const [selectedFile] = filePaths

  fs.stat(selectedFile, (error, stats) => {
    if (error) {
      logger.error('request.chat.sendfile', error)
      event.sender.send('response.chat.sendfile', {
        success: false,
        arg,
        payload: { error: error.message }
      })
    } else {
      logger.info('request.chat.sendfile', stats)

      const hash = crypto.createHash('sha1')
      hash.update(JSON.stringify({ selectedFile, stats }))
      const digest = hash.digest('base64')

      const infoobj = {
        name: path.basename(selectedFile),
        size: stats.size,
        digest
      }

      event.sender.send('response.chat.sendfile', {
        success: true,
        arg,
        payload: { infoobj }
      })

      const sstream = ss.createStream()
      const pstream = ps({ length: stats.size, time: 200 })

      pstream.on('progress', progress => {
        logger.info(progress)
        fileProgressEventBus.emit('chat.sendfile.progress', infoobj, progress)
      })

      ss(socket).emit('q.chat.sendfile', sstream, { touid: arg.touid, infoobj })

      fs.createReadStream(selectedFile)
        .pipe(pstream)
        .pipe(sstream)
    }
  })
})

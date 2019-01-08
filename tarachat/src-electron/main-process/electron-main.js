import { app, BrowserWindow } from 'electron'

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path')
    .join(__dirname, 'statics')
    .replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

require('../services/index')
const socket = require('../services/socket')
const fpeb = require('../services/chat')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

socket.on('broadcast.online', payload => {
  logger.info('broadcast.online', payload)
  mainWindow.webContents.send('broadcast.online', payload)
})

socket.on('broadcast.offline', payload => {
  logger.info('broadcast.offline', payload)
  mainWindow.webContents.send('broadcast.offline', payload)
})

socket.on('q.chat.receivemsg', payload => {
  const { fromuid, message, digest } = payload
  logger.info('q.chat.receivemsg', fromuid, message)

  mainWindow.webContents.send('q.chat.receivemsg', payload)
  socket.emit('r.chat.receivemsg', { fromuid, digest })
})

fpeb.on('chat.sendfile.progress', (infoobj, progress) => {
  mainWindow.webContents.send('chat.sendfile.progress', { infoobj, progress })
})

socket.on('r.chat.sendfile', payload => {
  // const {touid, digest} = payload
  mainWindow.webContents.send('r.chat.sendfile', payload)
})

const fs = require('fs')
const ps = require('progress-stream')
const ss = require('socket.io-stream')
const path = require('path')

ss(socket).on('q.chat.receivefile', (instream, payload) => {
  const { fromuid, touid, name, size, digest } = payload
  const parseobj = path.parse(name)

  const prefix = app.getPath('downloads')
  const newPath = path.join(prefix, `${parseobj.name}_${digest}${parseobj.ext}`)

  logger.info('q.chat.receivefile', newPath)

  const pstream = ps({ length: size, time: 200 })

  mainWindow.webContents.send('chat.receivefile', {
    fromuid,
    name,
    newPath,
    digest
  })

  pstream.on('progress', progress => {
    logger.info(progress)
    mainWindow.webContents.send('chat.receivefile.progress', {
      infoobj: { fromuid, touid, name, size, digest },
      progress
    })
  })

  instream.pipe(pstream).pipe(fs.createWriteStream(newPath))
})

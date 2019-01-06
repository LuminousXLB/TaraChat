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

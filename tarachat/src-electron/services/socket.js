// const { ipcMain } = require('electron')
// const EventEmitter = require('events')
const socket = require('socket.io-client')('http://192.168.3.29:5800')
// const crypto = require('crypto')
const logger = require('log4js').getLogger(__filename)
logger.level = 'debug'

// const MASTER_PUBLIC_KEY = '023a6f2b2ffb4139a773f48b0febb85dbc20d199b44f40f543edb2c92c633ee03e'

socket.on('reconnect', attemptNumber => {
  logger.info('reconnect')
})

socket.on('reconnect_attempt', attemptNumber => {
  logger.info(`reconnect_attempt ${attemptNumber}`)
})

socket.on('reconnecting', attemptNumber => {
  logger.info(`reconnecting ${attemptNumber}`)
})

socket.on('reconnect_error', error => {
  logger.error('reconnect_error', error)
})

socket.on('reconnect_failed', () => {
  logger.warn('reconnect_failed')
})

module.exports = socket

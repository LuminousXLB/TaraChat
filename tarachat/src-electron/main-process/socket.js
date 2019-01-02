const net = require('net')
const EventEmitter = require('events')
// const crypto = require('crypto')
const logger = require('log4js').getLogger('socket')
logger.level = 'debug'

// const MASTER_PUBLIC_KEY = '023a6f2b2ffb4139a773f48b0febb85dbc20d199b44f40f543edb2c92c633ee03e'

class TaraSocketProxy extends EventEmitter {
  constructor () {
    super()

    this.client = net.connect({ port: 3000 })

    this.client.on('data', chunk => {
      const { action, success, payload } = JSON.parse(chunk)
      this.emit(action, success, payload)
    })

    this.client.on('end', () => {
      logger.info('end')
    })

    this.client.on('close', () => {
      logger.info('close')
    })

    this.client.on('timeout', () => {
      logger.warn('timeout')
    })

    this.client.on('error', err => {
      logger.error('error', err)
    })

    if (!process.env.__sessionid) {
      this.createSession()
    }
  }

  createSession () {
    this.on('session.create', (success, payload) => {
      logger.info('session.create', payload)
      process.env.__sessionid = payload.sessionid
    })

    this.client.on('ready', () => {
      this.send('session.create', {
        info: [this.client.localAddress, this.client.localPort]
      })
    })
  }

  send (action, payload) {
    const timestamp = Date.now()
    this.client.write(
      JSON.stringify({
        action,
        sessionid: process.env.__sessionid,
        timestamp,
        payload
      })
    )
  }
}

const taraSocket = new TaraSocketProxy()

module.exports = taraSocket

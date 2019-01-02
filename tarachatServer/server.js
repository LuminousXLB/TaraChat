const { redisTask, sampleCallback } = require('./redis')
const EventEmitter = require('events')
const net = require('net')
const crypto = require('crypto')
const logger = require('log4js').getLogger('server')
logger.level = 'debug'

const MASTER_PRIVATE_KEY =
  '44ebdea1cbdf757d1949135628a2b432ae4adae1586e1eaa389146ecdb40a4ad'

const eventTable = {
  'session.create': (socket, action, timestamp, sessionid, payload) => {
    const { info } = payload

    let hash = crypto.createHash('ripemd160')
    hash.update(crypto.randomBytes(20))
    hash.update(JSON.stringify(info))
    sessionid = hash.digest('base64')

    logger.info('sessionid', sessionid)
    redisTask(client => {
      client.set(`session:${sessionid}`, JSON.stringify(info), sampleCallback)
      client.get(`session:${sessionid}`, sampleCallback)
      client.expire(`session:${sessionid}`, 60 * 30, sampleCallback)
    })

    socket.write(
      JSON.stringify({
        success: 1,
        action: action,
        payload: { sessionid }
      })
    )
  }
}

this.server = net.createServer(socket => {
  socket.on('error', error => {
    logger.error('error', error)
  })

  socket.on('data', chunk => {
    const ts = Date.now()
    const { action, timestamp, sessionid, payload } = JSON.parse(chunk)
    logger.info('data', { action, timestamp, sessionid, payload })

    if (eventTable[action]) {
      eventTable[action](socket, action, timestamp, sessionid, payload)
    }
  })
})

const server = net.createServer(socket => {
  socket.on('error', error => {
    logger.error('error', error)
  })

  socket.on('data', chunk => {
    const ts = Date.now()
    const { action, timestamp, sessionid, payload } = JSON.parse(chunk)
    logger.info('data', { action, timestamp, sessionid, payload })

    if (eventTable[action]) {
      eventTable[action](socket, action, timestamp, sessionid, payload)
    }
  })
})

server.on('listening', () => {
  logger.info('listening')
})

server.on('connection', socket => {
  logger.info('connection')
})

server.on('error', error => {
  logger.error(error)
})

server.on('close', () => {
  logger.info('close')
})

server.listen(3000, () => {
  console.log(`server is on ${JSON.stringify(server.address())}`)
})

const EventEmitter = require('events')
const net = require('net')
const logger = require('log4js').getLogger('server')

logger.level = 'debug'

const MASTER_PRIVATE_KEY =
  '44ebdea1cbdf757d1949135628a2b432ae4adae1586e1eaa389146ecdb40a4ad'

const eventTable = require('./servants/index')

const server = net.createServer(socket => {
  socket.on('error', error => {
    logger.error('error', error)
  })

  socket.on('data', chunk => {
    const ts = Date.now()
    const { action, timestamp, sessionid, payload } = JSON.parse(chunk)
    logger.info('data', { action, timestamp, sessionid, payload })

    const actionparts = action.split('.')

    if (eventTable[actionparts[0]]) {
      eventTable[actionparts[0]][action](
        socket,
        action,
        timestamp,
        sessionid,
        payload
      )
    } else {
      logger.warn(JSON.parse(chunck))
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

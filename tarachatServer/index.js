const server = require('http').createServer()
const io = require('socket.io')(server)
const pg = require('./db/postgres')
// const crypto = require('crypto')
const logger = require('log4js').getLogger(__filename)

process.env.LoggerLevel = 'debug'
logger.level = process.env.LoggerLevel

let UID2SOCKETID = {}

server.listen(5800, '::', () => {
  logger.info(`Listening at ${JSON.stringify(server.address())}`)
})

io.on('connection', socket => {
  logger.info(`Client ${socket.id} connected`)

  // q.auth Listener
  socket.on('q.auth.register', ({ nickname, email, hashPwd }) => {
    const rEvent = 'r.auth.register'

    let error = ''
    if (!nickname) {
      error = 'Nickname cannot be empty'
    } else if (!email) {
      error = 'Email cannot be empty'
    } else if (!hashPwd) {
      error = 'Password cannot be empty'
    }
    if (error !== '') {
      socket.emit(rEvent, false, { error })
      return
    }

    pwd = Buffer.from(hashPwd, 'hex')

    pg.query(
      'INSERT INTO users(email, hashpwd, nickname) VALUES($1, $2, $3) RETURNING *',
      [email, pwd, nickname]
    )
      .then(result => {
        socket.emit(rEvent, true, {
          nickname: result.rows[0].nickname
        })
      })
      .catch(error => {
        logger.error(error.stack)

        if (error.code === '23505' && error.constraint === 'Users_email_key') {
          error = 'The Email address has been registered'
        }

        socket.emit(rEvent, false, { error })
      })
  })

  socket.on('q.auth.login', ({ email, hashPwd }) => {
    const rEvent = 'r.auth.login'

    if (!email) {
      socket.emit(rEvent, false, { error: `Email cannot be empty` })
      return
    }

    pg.query('SELECT uid, nickname, hashpwd FROM users WHERE email=$1', [email])
      .then(result => {
        qHashPwd = Buffer.from(result.rows[0].hashpwd)
        if (qHashPwd.toString('hex') === hashPwd) {
          const { uid, nickname } = result.rows[0]

          if (UID2SOCKETID[uid]) {
            socket.emit(rEvent, false, {
              error: `The account has logged on elsewhere`
            })
          } else {
            UID2SOCKETID[uid] = socket.id
            socket.uid = uid
            socket.nickname = nickname

            socket.emit(rEvent, true, { uid, nickname })
            socket.broadcast.emit('broadcast.online', { uid, nickname })
          }
        } else {
          socket.emit(rEvent, false, { error: 'Wrong Password or Email' })
        }
      })
      .catch(error => {
        logger.error(error.stack)
        socket.emit(rEvent, false, { error })
      })
  })

  socket.on('q.auth.logout', () => {
    const { uid, nickname } = socket
    delete UID2SOCKETID[socket.uid]
    socket.emit('r.auth.logout', true)
    socket.broadcast.emit('broadcast.offline', { uid, nickname })
  })

  // q.chat Listener
  socket.on('q.chat.onlineusers', () => {
    const rEvent = 'r.chat.onlineusers'
    if (Object.keys(UID2SOCKETID).length > 0) {
      pg.query(
        `SELECT uid, nickname FROM users WHERE uid IN (${Object.keys(
          UID2SOCKETID
        ).join(', ')})`
      )
        .then(result => {
          socket.emit(rEvent, true, {
            onlineusers: result.rows
          })
        })
        .catch(error => {
          logger.error(error.stack)
          socket.emit(rEvent, false, { error })
        })
    } else {
      socket.emit(rEvent, true, {
        uid,
        nickname,
        onlineusers: []
      })
    }
  })

  socket.on('q.chat.sendmsg', ({ touid, message, digest, timestamp }) => {
    logger.info('q.chat.sendmsg', touid, message)
    socket
      .to(UID2SOCKETID[touid])
      .emit('q.chat.receivemsg', {
        fromuid: socket.uid,
        message,
        digest,
        timestamp
      })
  })

  socket.on('r.chat.receivemsg', ({ fromuid, digest }) => {
    logger.info('r.chat.receivemsg', fromuid)
    socket
      .to(UID2SOCKETID[fromuid])
      .emit('r.chat.sendmsg', { touid: socket.uid, digest })
  })

  // common Listener
  socket.on('disconnect', reason => {
    logger.warn(`Client ${socket.id} disconnected for ${reason}`)
    const { uid, nickname } = socket
    delete UID2SOCKETID[socket.uid]
    socket.emit('r.auth.logout', true)
    socket.broadcast.emit('broadcast.offline', { uid, nickname })
  })

  socket.on('error', error => {
    logger.error(`Client ${socket.id} error`, error)
  })
})

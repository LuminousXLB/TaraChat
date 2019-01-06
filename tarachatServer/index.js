const server = require('http').createServer()
const io = require('socket.io')(server)
const pg = require('./db/postgres')
const logger = require('log4js').getLogger(__filename)

process.env.LoggerLevel = 'debug'
logger.level = process.env.LoggerLevel

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
      [email, pwd, nickname],
      (error, result) => {
        if (error) {
          logger.error(error.stack)

          if (
            error.code === '23505' &&
            error.constraint === 'Users_email_key'
          ) {
            error = 'The Email address has been registered'
          }

          socket.emit(rEvent, false, { error })
        } else {
          socket.emit(rEvent, true, {
            nickname: result.rows[0].nickname
          })
        }
      }
    )
  })

  socket.on('q.auth.login', ({ email, hashPwd }) => {
    const rEvent = 'r.auth.login'

    if (!email) {
      socket.emit(rEvent, false, { error: `Email cannot be empty` })
      return
    }

    pg.query(
      'SELECT nickname, hashpwd FROM users WHERE email=$1',
      [email],
      (error, result) => {
        if (error) {
          logger.error(error.stack)
          socket.emit(rEvent, false, { error })
        } else {
          qHashPwd = Buffer.from(result.rows[0].hashpwd)
          if (qHashPwd.toString('hex') === hashPwd) {
            socket.emit(rEvent, true, {
              nickname: result.rows[0].nickname
            })
          } else {
            socket.emit(rEvent, false, { error: 'Wrong Password or Email' })
          }
        }
      }
    )
  })

  socket.on('q.auth.logout', () => {
    socket.emit('r.auth.logout', true)
  })

  // common Listener
  socket.on('disconnect', reason => {
    logger.warn(`Client ${socket.id} disconnected for ${reason}`)
  })

  socket.on('error', error => {
    logger.error(`Client ${socket.id} error`, error)
  })
})

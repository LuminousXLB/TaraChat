const pg = require('../models/postgres')

module.exports = {
  'auth.register': (socket, action, timestamp, sessionid, payload) => {
    const { nickname, email, hashPwd } = payload
    const stmt =
      'INSERT INTO Users(email, hashpwd, nickname) VALUES($1, $2) RETURNING *'
    const values = [email, Buffer.from(hashPwd, 'hex'), nickname]
    pg.query(stmt, values, (error, result) => {
      if (error) {
        logger.error(error.stack)
        socket.write(
          JSON.stringify({
            success: 0,
            action: action,
            payload: { error }
          })
        )
      } else {
        console.log(    )
        socket.write(
          JSON.stringify({
            success: 1,
            action: action,
            payload: result
          })
        )
      }
    })
  },
  'auth.login': (socket, action, timestamp, sessionid, payload) => {},
  'auth.logout': (socket, action, timestamp, sessionid, payload) => {}
}

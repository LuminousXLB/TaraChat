const { ipcMain } = require('electron')
const crypto = require('crypto')
const socket = require('./socket')

ipcMain.on('request.auth.register', (event, arg) => {
  const { nickname, email, password } = arg

  const hmac = crypto.createHmac('sha256', email)
  hmac.update(password)
  const hashPwd = hmac.digest('hex')

  socket.once('r.auth.register', (success, payload) => {
    event.sender.send('response.auth.register', {
      success,
      arg,
      payload
    })
  })

  socket.emit('q.auth.register', {
    nickname,
    email,
    hashPwd
  })
})

ipcMain.on('request.auth.login', (event, arg) => {
  const { email, password } = arg

  const hmac = crypto.createHmac('sha256', email)
  hmac.update(password)
  const hashPwd = hmac.digest('hex')

  socket.once('r.auth.login', (success, payload) => {
    event.sender.send('response.auth.login', {
      success,
      arg,
      payload
    })
  })

  socket.emit('q.auth.login', {
    email,
    hashPwd
  })
})

ipcMain.on('request.auth.logout', event => {
  socket.once('r.auth.logout', (success, payload) => {
    event.sender.send('response.auth.logout', {
      success: true,
      payload
    })
  })

  socket.emit('q.auth.logout')
})

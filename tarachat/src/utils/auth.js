import ipcCommonClient from './common.js'
// import { SessionStorage } from 'quasar'
// const { ipcRenderer } = require('electron')

export const Register = ({ nickname, email, password }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.auth.register',
      responseEventName: 'response.auth.register'
    },
    { nickname, email, password }
  )

export const Login = ({ email, password }) =>
  ipcCommonClient(
    {
      requestEventName: 'request.auth.login',
      responseEventName: 'response.auth.login'
    },
    { email, password }
  )

export const Logout = () =>
  ipcCommonClient({
    requestEventName: 'request.auth.logout',
    responseEventName: 'response.auth.logout'
  })

// ipcRenderer.on('broadcast.online', (event, arg) => {
//   console.log(__filename, 'broadcast.online', arg)
//   // console.log(SessionStorage)
//   let ou = SessionStorage.get.item('onlineusers')
//   ou.push(arg)
//   SessionStorage.set('onlineusers', ou)
// })

// ipcRenderer.on('broadcast.offline', (event, arg) => {
//   console.log(__filename, 'broadcast.offline', arg)
//   // console.log(SessionStorage)
//   let ou = SessionStorage.get.item('onlineusers')
//   delete ou[arg.uid]
//   SessionStorage.set('onlineusers', ou)
// })

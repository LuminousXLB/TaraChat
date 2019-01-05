// const { ipcRenderer } = require('electron')
import stdIpcCommunication from './common.js'

export const Register = ({ nickname, email, password }) =>
  stdIpcCommunication(
    {
      requestEventName: 'request.auth.register',
      responseEventName: 'response.auth.register'
    },
    { nickname, email, password }
  )

export const Login = ({ email, password }) =>
  stdIpcCommunication(
    {
      requestEventName: 'request.auth.login',
      responseEventName: 'response.auth.login'
    },
    { email, password }
  )

export const Logout = () =>
  stdIpcCommunication({
    requestEventName: 'request.auth.logout',
    responseEventName: 'response.auth.logout'
  })

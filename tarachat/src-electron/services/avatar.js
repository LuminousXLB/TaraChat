const { ipcMain } = require('electron')
const jdenticon = require('jdenticon')

ipcMain.on('request.avatar', (event, arg) => {
  const uriHeader = 'data:image/png;base64,'
  console.log(__filename, arg.identity)
  event.sender.send('response.avatar', {
    success: true,
    arg,
    payload: {
      uri:
        uriHeader + jdenticon.toPng(arg.identity, arg.size).toString('base64')
    }
  })
})

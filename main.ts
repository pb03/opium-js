import { app, BrowserWindow } from 'electron'

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1140,
    height: 680,
    backgroundColor: '#171717',
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // mainWindow.openDevTools()

  require('./menu')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

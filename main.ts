import { app, BrowserWindow, Menu } from 'electron'
const menuTemplate = require('./menuTemplate')

let mainWindow

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1140,
    height: 680,
    backgroundColor: '#161618',
    titleBarStyle: 'hidden'
  })

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  setAppMenu()
}

const setAppMenu = () => {
  menuTemplate.push({
    role: 'help',
    submenu: [
      {
        label: 'Keyboard Shortcuts',
        click () { createHelpWindow() }
      }
    ]
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

const createHelpWindow = () => {
  let helpWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    width: 480,
    height: 330,
    backgroundColor: '#101011',
    resizable: false
  })

  helpWindow.loadURL('file://' + __dirname + '/help.html')
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow()
  }
})

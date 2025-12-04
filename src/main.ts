import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import menuTemplate from './menu'

let appWindow: Electron.BrowserWindow

const createAppWindow = () => {
  appWindow = new BrowserWindow({
    width: 1140,
    height: 680,
    backgroundColor: '#161618',
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'assets/icons/512x512.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  appWindow.loadURL(`file://${__dirname}/index.html`)

  // Show window when ready to prevent white flash
  appWindow.once('ready-to-show', () => {
    appWindow.show()
  })

  appWindow.on('closed', () => {
    appWindow = null
  })

  // appWindow.webContents.openDevTools()

  const appMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(appMenu)
}

app.on('ready', createAppWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (appWindow === null) {
    createAppWindow()
  }
})

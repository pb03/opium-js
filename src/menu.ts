import { app, shell } from 'electron'

const edit = {
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'selectall' }
  ]
}

const view = {
  label: 'View',
  submenu: [
    { role: 'resetzoom' },
    { role: 'zoomin' },
    { role: 'zoomout' },
    { type: 'separator' },
    { role: 'togglefullscreen' }
  ]
}

const window = {
  role: 'window',
  submenu: [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' }
  ]
}

const help = {
  role: 'help',
  submenu: [
    {
      label: 'Github repo',
      click() { shell.openExternal('https://github.com/pb03/opium-js') }
    }
  ]
}

const menuTemplate: any[] = [edit, view, window, help]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

export default menuTemplate

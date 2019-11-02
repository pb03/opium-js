const { app, shell } = require('electron')

const menuTemplate = [
  {
    label: 'View',
    submenu: [
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Github repo',
        click() { shell.openExternal('https://github.com/pb03/opium-js') }
      }
    ]
  }
]

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

module.exports = menuTemplate

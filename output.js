const { inspect } = require('util')

const output = code => {
  if (code === console.log) return

  if (typeof code === 'function') {
    return code.toString()
  }

  const depth = opmIsCyclic(code) ? 0 : 100
  const isCompact = Array.isArray(code) && inspect(code).length < 55

  return inspect(code, { compact: isCompact, depth: depth, breakLength: 55 })
}

const opmIsCyclic = obj => {
  let seenObjects = []

  function detect (obj) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true
      }
      seenObjects.push(obj)
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          return true
        }
      }
    }
  }
  return detect(obj)
}

module.exports = output

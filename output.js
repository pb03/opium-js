const { inspect } = require('util')

const output = code => {
  if (code === console.log) return

  if (typeof code === 'function') {
    /**
     * Instanbul alters the input code and adds `cov` statements to know if
     * a function is executed or not. We need to trim them off, when
     * logging the function to console.
     */
    return code.toString().split('\n').filter((line) => {
      return !line.trim().startsWith('cov')
    }).join('\n')
  }

  // If cyclic, ignore nested objects
  const depth = isCyclic(code) ? 0 : 100

  // If output is less than 55 characters long,
  // log it in one line
  const isCompact = Array.isArray(code) && inspect(code).length < 55

  return inspect(code, {
    compact: isCompact,
    depth: depth,
    breakLength: Infinity
  })
}

const isCyclic = obj => {
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

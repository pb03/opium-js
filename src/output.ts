const { inspect } = require('util')

const output = (code: any) => {
  if (code === console.log) return

  if (typeof code === 'function') {
    /**
     * Instanbul alters the input code and adds `cov` statements to know if
     * a function is executed or not. We need to trim them off, when
     * logging the function to console.
     */
    return code.toString().split('\n').filter((line: string) => {
      return !line.trim().startsWith('cov')
    }).join('\n')
  }

  // If cyclic, ignore nested objects
  const depth: number = isCyclic(code) ? 0 : 100

  // If output is less than 55 characters long,
  // log it in one line
  const isCompact: boolean = Array.isArray(code) && inspect(code).length < 55

  return inspect(code, {
    compact: isCompact,
    depth: depth,
    breakLength: Infinity
  })
}

const isCyclic = obj => {
  try {
    JSON.stringify(obj)
  } catch (error) {
    return error.message.includes('Converting circular structure to JSON')
  }
  return false
}

module.exports = output

const converage = code => {
  let errorMessage = ''
  let lines = []
  let opmLineNos = []
  let currentLine = 1
  let prevLine = ''

  code = code.split('\n').map((line, i) => {
    if (line === ''
        || /^((\s+)?[\]})];?(\s+)?)$/.test(line)
        || /^(\s+)?\/\//.test(line)
        || /(\s+)?}?(\s+)?else/.test(line)
        || /(\s+)?\/\*\*(\s+)?/.test(line)
        || /^(\s+)?}(\s+)?,(\s+)?{?(\s+)?$/.test(line)
        || /^(\s+)?}?(\s+)?](\s+)?;?(\s+)?$/.test(line)
        || /,(\s+)?$/.test(line)
        || /^(\s+)?\./.test(line)
        || /,(\s+)?$/.test(prevLine)
        || /=>(\s+)?$/.test(prevLine)
        || /=(\s+)?{?(\s+)?$/.test(prevLine)
      ) {
      currentLine++
      prevLine = line
      return line
    }

    prevLine = line
    return `opmLineNos.push(${currentLine++});${line}`
  }).join('\n')

  try {
    eval(code)
  } catch (err) {
    errorMessage = err
  }

  opmLineNos.forEach(lineNo => {
    const obj = {
      range: new monaco.Range(lineNo, 1, lineNo, 1),
      options: { linesDecorationsClassName: 'dotDecoration' }
    }
    lines.push(obj)
  })

  return { lines, errorMessage }
}

module.exports = converage

const istanbul = require('istanbul-lib-instrument')
const instrumenter = istanbul.createInstrumenter({ noAutoWrap: true, compact: false })

module.exports = function instrument(code) {
  const filename = `f-${new Date().getTime()}`
  let evalError = null

  try {
    eval(instrumenter.instrumentSync(code, filename))
  } catch (error) {
    evalError = error
  }

  /**
   * Return early when unable to execute the code
   */
  if (evalError) {
    return {
      error: evalError,
      lines: [],
    }
  }

  /**
   * An array of executed and lines.
   */
  const executedLines = []
  // @ts-ignore
  const statementsMap = __coverage__[filename]['statementMap']
  // @ts-ignore
  const statementsIterations = __coverage__[filename]['s']

  Object.keys(statementsIterations).forEach((index) => {
    const statement = statementsMap[index]
    if (statementsIterations[index] > 0) {
      executedLines.push(statement.start.line)
    }
  })

  return {
    error: evalError,
    lines: executedLines.map((line) => {
      return {
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1
        },
        options: {
          linesDecorationsClassName: 'dotDecoration'
        }
      }
    })
  }
}

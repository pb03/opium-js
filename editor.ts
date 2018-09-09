/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

declare const amdRequire
const theme = require('./theme')
const output = require('./output')
const coverage = require('./coverage')
const autoCompletions = require('./autoCompletions')

let monacoInput: monaco.editor.IStandaloneCodeEditor
let monacoOutput: monaco.editor.IStandaloneCodeEditor

const monacoOptions = {
  language: 'javascript',
  automaticLayout: true,
  folding: true,
  theme: 'afeemTheme',
  contextmenu: false,
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  }
}

let coverageDots
let coverageLines = []
let errorHighlights = []

const initMonacoInput = () => {
    monacoInput = monaco.editor.create(document.getElementById('input'), {
      ...monacoOptions,
      value: localStorage.getItem('code') || '',
      fontSize: 13,
      lineHeight: 24,
      renderLineHighlight: 'none',
      multiCursorModifier: 'ctrlCmd'
    })

    monacoInput.focus()

    monacoInput.getModel().updateOptions({ tabSize: 2 })

    monacoInput.addAction({
      id: 'run-function',
      label: 'Run',

      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R
      ],

      run: ed => {
        const code = ed.getValue()

        clearCoverageDots()

        try {
          eval(code)
        } catch (err) {
          opmAppendOutput(err, true)
        }
      }
    })

    monacoInput.addAction({
      id: 'code-coverage',
      label: 'Code coverage',

      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_R
      ],

      run: ed => {
        const code = ed.getValue()

        clearCoverageDots()

        const { lines, errorMessage } = coverage(code)
        coverageLines = lines
        coverageDots = monacoInput.deltaDecorations([], coverageLines)

        if (errorMessage) {
          opmAppendOutput(errorMessage, true)
        }
      }
    })

    monacoInput.addAction({
      id: 'clear-output',
      label: 'Clear output',

      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K
      ],

      run: () => {
        monacoOutput.setValue('')
        errorHighlights = []
      }
  })

  monacoInput.addAction({
    id: 'save',
    label: 'Save',

    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_S
    ],

    run: ed => {
      localStorage.setItem('code', ed.getValue())
    }
  })
}

const initMonacoOutput = () => {
  monacoOutput = monaco.editor.create(document.getElementById('output'), {
    ...monacoOptions,
    lineNumbers: 'off',
    fontSize: 12,
    lineHeight: 21,
    readOnly: true,
    matchBrackets: false,
    renderLineHighlight: 'none'
  })

  monacoOutput.getModel().updateOptions({ tabSize: 2 })
}

console.log = code => {
  opmAppendOutput(output(code), false)
}

const opmAppendOutput = (code, isError) => {
  const updatedValue = monacoOutput.getValue() + code + '\n\n'
  const totalLines = (updatedValue.match(/\n/gm) || []).length

  monacoOutput.setValue(updatedValue)
  monacoOutput.revealLine(totalLines)

  if (isError) {
    appendErrorHighlight(totalLines - 1)
  }

  monacoOutput.deltaDecorations([], errorHighlights)
}

const appendErrorHighlight = lineNo => {
  errorHighlights.push({
    range: new monaco.Range(lineNo, 1, lineNo, 100),
    options: { inlineClassName: 'inlineDecoration' }
  })
}

const clearCoverageDots = () => {
  if (coverageLines.length) {
    monacoInput.deltaDecorations(coverageDots, [])
  }
}

amdRequire(['vs/editor/editor.main'], () => {
  monaco.editor.defineTheme('afeemTheme', theme)

  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: () => autoCompletions
  })

  initMonacoInput()
  initMonacoOutput()
})

/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

declare const amdRequire
const theme = require('./theme')
const output = require('./output')
const coverage = require('./coverage')
const autoCompletions = require('./autoCompletions')

type Editor = monaco.editor.IStandaloneCodeEditor

let monacoInput: Editor
let monacoOutput: Editor

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

let coverageDots = []
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

    run: (editor: Editor) => {
      const code: string = editor.getValue()

      clearCoverageDots()

      try {
        eval(code)
      } catch (error) {
        opmAppendOutput(error, true)
      }
    }
  })

  monacoInput.addAction({
    id: 'code-coverage',
    label: 'Code coverage',

    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_R
    ],

    run: (editor: Editor) => {
      const code = editor.getValue()

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

    run: (editor: Editor) => {
      localStorage.setItem('code', editor.getValue())
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

console.log = (code: string) => {
  opmAppendOutput(output(code), false)
}

const opmAppendOutput = (code: string, isError: boolean) => {
  const updatedValue = monacoOutput.getValue() + code + '\n\n'
  const totalLines = (updatedValue.match(/\n/gm) || []).length

  monacoOutput.setValue(updatedValue)
  monacoOutput.revealLine(totalLines)

  if (isError) {
    appendErrorHighlight(totalLines - 1)
  }

  monacoOutput.deltaDecorations([], errorHighlights)
}

const appendErrorHighlight = (lineNo: number) => {
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

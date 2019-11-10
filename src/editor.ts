/// <reference path="../node_modules/monaco-editor/monaco.d.ts" />

declare const amdRequire
const afeemTheme = require('./theme')
const getOutput = require('./output')
const autoCompletions = require('./completions')
const instrument = require('./instrument')

type Editor = monaco.editor.IStandaloneCodeEditor

let monacoInput: Editor
let monacoOutput: Editor

const monacoOptions = {
  language: 'javascript',
  automaticLayout: true,
  folding: true,
  theme: 'afeemTheme',
  fontFamily: 'Cascadia Code, Menlo, serif',
  fontLigatures: true,
  contextmenu: false,
  minimap: { enabled: false },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0
  }
}

const visualState = {
  editor: {
    isDirty: false,
    coverageDots: [],
    clear() {
      this.coverageDots = []
    }
  },
  console: {
    errorHighlights: [],
    clear() {
      this.errorHighlights = []
    },
  },
}

const initMonacoInput = () => {
  monacoInput = monaco.editor.create(document.getElementById('input'), {
    ...monacoOptions,
    value: localStorage.getItem('code') || '',
    fontSize: 14,
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

      editor.getAction('editor.action.formatDocument').run()

      // const { error } = instrument(code)
      // if (error) {
      //   opmAppendOutput(error, true)
      // }

      try {
        eval(code)
      } catch (error) {
        opmAppendOutput(error, true)
      }

      clearCoverageDots()
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

      const { lines, error } = instrument(code)
      visualState.editor.coverageDots = monacoInput.deltaDecorations([], lines)
      visualState.editor.isDirty = false

      if (error) {
        opmAppendOutput(error, true)
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
      visualState.console.clear()
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

  /**
   * Cleaning up coverage dots, when content changes. Method is noop, when `isDirty=true`.
   */
  monacoInput.onDidChangeModelContent(() => {
    if (visualState.editor.isDirty) {
      return
    }

    clearCoverageDots()
    visualState.editor.isDirty = true
  })
}

const initMonacoOutput = () => {
  monacoOutput = monaco.editor.create(document.getElementById('output'), {
    ...monacoOptions,
    lineNumbers: 'off',
    fontSize: 13,
    lineHeight: 21,
    readOnly: true,
    matchBrackets: false,
    renderLineHighlight: 'none'
  })

  monacoOutput.getModel().updateOptions({ tabSize: 2 })
}

console.log = (code: string) => {
  opmAppendOutput(getOutput(code), false)
}

const opmAppendOutput = (code: string, isError: boolean) => {
  const updatedValue = monacoOutput.getValue() + code + '\n\n'
  const totalLines = (updatedValue.match(/\n/gm) || []).length

  monacoOutput.setValue(updatedValue)
  monacoOutput.revealLine(totalLines)

  if (isError) {
    appendErrorHighlight(totalLines - 1)
  }

  monacoOutput.deltaDecorations([], visualState.console.errorHighlights)
}

const appendErrorHighlight = (lineNo: number) => {
  visualState.console.errorHighlights.push({
    range: new monaco.Range(lineNo, 1, lineNo, 100),
    options: { inlineClassName: 'inlineDecoration' }
  })
}

const clearCoverageDots = () => {
  monacoInput.deltaDecorations(visualState.editor.coverageDots, [])
  visualState.editor.clear()
}

amdRequire(['vs/editor/editor.main'], () => {
  monaco.editor.defineTheme('afeemTheme', afeemTheme)

  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: () => autoCompletions
  })

  initMonacoInput()
  initMonacoOutput()
})

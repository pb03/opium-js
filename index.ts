/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

declare var amdRequire
const output = require('./output')

var monacoInput: monaco.editor.IStandaloneCodeEditor
var monacoOutput: monaco.editor.IStandaloneCodeEditor

console.log = code => {
  opmAppendOutput(output(code), false)
}

let errorHighlights = []
const appendErrorHighlight = lineNo => {
  var obj = {
    range: new monaco.Range(lineNo, 1, lineNo, 100),
    options: { inlineClassName: 'myInlineDecoration' }
  }
  errorHighlights.push(obj)
}

const opmAppendOutput = (code, isError) => {
  const currentValue = monacoOutput.getValue()
  const separator = currentValue ? '\n\n' : ''
  const updatedValue = currentValue + separator + code

  monacoOutput.setValue(updatedValue)
  const totalLines = (updatedValue.match(/\n/gm) || []).length
  monacoOutput.revealLine(totalLines + 5)

  if (isError) {
    appendErrorHighlight(totalLines + 1)
  }
  monacoOutput.deltaDecorations([], errorHighlights)
}

const initMonacoInput = () => {
    monacoInput = monaco.editor.create(document.getElementById('input'), {
      value: localStorage.getItem('code') || '',
      language: 'javascript',
      automaticLayout: true,
      fontSize: 13,
      lineHeight: 24,
      folding: true,
      theme: 'vs-dark',
      renderLineHighlight: 'none',
      multiCursorModifier: 'ctrlCmd',
      contextmenu: false,
      minimap: { enabled: false },
      scrollbar: {
        verticalScrollbarSize: 4,
        horizontalScrollbarSize: 4
      }
    })

    monacoInput.getModel().updateOptions({ tabSize: 2 })

    monacoInput.focus()

    monacoInput.addAction({
      id: 'run-function',
      label: 'Run',

      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_R
      ],

      run: ed => {
        const code = ed.getValue()

        try {
          eval(code)
        } catch(err) {
          opmAppendOutput(err, true)
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
    value: '',
    language: 'javascript',
    automaticLayout: true,
    lineNumbers: 'off',
    fontSize: 13,
    lineHeight: 21,
    readOnly: true,
    folding: true,
    matchBrackets: false,
    theme: 'vs-dark',
    renderLineHighlight: 'none',
    contextmenu: false,
    minimap: { enabled: false },
    scrollbar: {
      verticalScrollbarSize: 4,
      horizontalScrollbarSize: 4
    }
  })

  monacoOutput.getModel().updateOptions({ tabSize: 2 })
}

amdRequire(['vs/editor/editor.main'], () => {
  initMonacoInput()
  initMonacoOutput()
})

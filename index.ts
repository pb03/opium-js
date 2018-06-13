/// <reference path="node_modules/monaco-editor/monaco.d.ts" />

declare var amdRequire
var monacoInput: monaco.editor.IStandaloneCodeEditor
var monacoOutput: monaco.editor.IStandaloneCodeEditor

console.log = code => {
  if (code === console.log) return

  if (typeof code === 'function') {
    opmAppendOutput(code.toString())
    return
  }

  if (Array.isArray(code)) {
    const codeString = (JSON.stringify(code)).replace(/,/g, ', ')

    if (codeString.match(/[^\n]/g).length < 55) {
      opmAppendOutput(codeString)
      return
    }
  }

  opmAppendOutput(JSON.stringify(code, null, ' '))
}

const opmAppendOutput = code => {
  const currentValue = monacoOutput.getValue()
  const separator = currentValue ? '\n\n' : ''
  const updatedValue = currentValue + separator + code

  monacoOutput.setValue(updatedValue)
  monacoOutput.revealLine((updatedValue.match(/\n/gm) || []).length + 5)
}

const initMonacoInput = () => {
    monacoInput = monaco.editor.create(document.getElementById('input'), {
      value: localStorage.getItem('code') || '',
      language: 'javascript',
      automaticLayout: true,
      fontSize: 14,
      lineHeight: 24,
      folding: true,
      theme: 'vs-dark',
      renderLineHighlight: 'none',
      multiCursorModifier: 'ctrlCmd',
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
          opmAppendOutput(err)
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
    language: 'json',
    automaticLayout: true,
    lineNumbers: 'off',
    fontSize: 13,
    lineHeight: 21,
    readOnly: true,
    folding: true,
    matchBrackets: false,
    theme: 'vs-dark',
    renderLineHighlight: 'none',
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

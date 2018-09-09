var autoCompletions = [
  {
    label: 'fre',
    detail: 'Insert forEach statement',
    insertText: {
      value: '${1:array}.forEach(${2:el} => {\n\t$0\n})'
    }
  },
  {
    label: 'fof',
    detail: 'Insert for...of statement',
    insertText: {
      value: 'for (let ${1:item} of ${2:object}) {\n\t$0\n}'
    }
  },
  {
    label: 'for',
    detail: 'Insert for loop',
    insertText: {
      value: 'for (let i = 0; i < ${1:array}.length; i++) {\n\t$0\n}'
    }
  },
  {
    label: 'rfor',
    detail: 'Insert reverse for loop',
    insertText: {
      value: 'for (let i = ${1:array}.length; i > 0; i--) {\n\t$0\n}'
    }
  },
  {
    label: 'if',
    detail: 'Insert if statement',
    insertText: {
      value: 'if ($1) {\n\t$0\n}'
    }
  },
  {
    label: 'ife',
    detail: 'Insert if/else statement',
    insertText: {
      value: 'if ($1) {\n\t$0\n} else {\n\t\n}'
    }
  },
  {
    label: 'sw',
    detail: 'Insert switch case statement',
    insertText: {
      value: 'switch (${1:expr}) {\n\tcase ${2:value}:\n\t\treturn $0\n\n\tdefault:\n\t\treturn\n}'
    }
  },
  {
    label: 'fn',
    detail: 'Insert function',
    insertText: {
      value: 'const ${1:myFunc} = ($2) => {\n\t$0\n}'
    }
  },
  {
    label: 'fnc',
    detail: 'Insert function with console log',
    insertText: {
      value: 'const ${1:myFunc} = ($2) => {\n\t$0\n}\n\nconsole.log(${1:myFunc}())'
    }
  },
  {
    label: 'cl',
    detail: 'Insert console.log',
    insertText: {
      value: 'console.log($1)$0'
    }
  },
  {
    label: 'sto',
    detail: 'Insert setTimeout function',
    insertText: {
      value: 'setTimeout(() => {\n\t$0\n}, ${1:delay})'
    }
  },
  {
    label: 'sti',
    detail: 'Insert setInterval function',
    insertText: {
      value: 'setInterval(() => {\n\t$0\n}, ${1:interval})'
    }
  }
]

module.exports = autoCompletions

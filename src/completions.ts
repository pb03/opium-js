module.exports = function getCompletions(monaco) {
  return {
    suggestions: [
      {
        label: 'fore',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert forEach statement',
        insertText: '${1:array}.forEach(${2:el} => {\n\t$0\n})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'fof',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert for...of statement',
        insertText: 'for (let ${1:item} of ${2:object}) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'for',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert for loop',
        insertText: 'for (let i = 0; i < ${1:array}.length; i++) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'rfor',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert reverse for loop',
        insertText: 'for (let i = ${1:array}.length; i > 0; i--) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert if statement',
        insertText: 'if ($1) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'ife',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert if/else statement',
        insertText: 'if ($1) {\n\t$0\n} else {\n\t\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'sw',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert switch case statement',
        insertText: 'switch (${1:expr}) {\n\tcase ${2:value}:\n\t\treturn $0\n\n\tdefault:\n\t\treturn\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'fn',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert function',
        insertText: 'const ${1:myFunc} = ($2) => {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'fnc',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert function with console log',
        insertText: 'const ${1:myFunc} = ($2) => {\n\t$0\n}\n\nconsole.log(${1:myFunc}())',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'cl',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert console.log',
        insertText: 'console.log($1)$0',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'sto',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert setTimeout function',
        insertText: 'setTimeout(() => {\n\t$0\n}, ${1:delay})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      },
      {
        label: 'si',
        kind: monaco.languages.CompletionItemKind.Snippet,
        detail: 'Insert setInterval function',
        insertText: 'setInterval(() => {\n\t$0\n}, ${1:interval})',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
      }
    ]
  }
}

const theme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword.js', foreground: '#8074da' },
    { token: 'delimiter.js', foreground: '#A7A9B2' },
    { token: 'delimiter.square.js', foreground: '#A7A9B2' },
    { token: 'delimiter.bracket.js', foreground: '#A7A9B2' },
    { token: 'delimiter.parenthesis.js', foreground: '#A7A9B2' },
    { token: 'number.js', foreground: '#EDB985' },
    { token: 'string.js', foreground: '#A6C9E2' },
    { token: 'comment', foreground: '#4B4B55', fontStyle: 'italic' }
  ],
  colors: {
    'editor.background': '#161618',
    'editorIndentGuide.background': '#313137',
    'editorIndentGuide.activeBackground': '#313137',
    'editorLineNumber.foreground': '#3F3F49',
    'editorLineNumber.activeForeground': '#76768B',
    'editorBracketMatch.border': '#3F3F49',
  }
}

module.exports = theme

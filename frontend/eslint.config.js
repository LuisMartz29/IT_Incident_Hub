import globals from 'globals'
export default [{
  files: ['**/*.{js,jsx}'],
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: { ...globals.browser, ...globals.node } },
  rules: {}
}]

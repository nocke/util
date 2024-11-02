import globals from 'globals'
import js from '@eslint/js'

// needed?!?
// import unusedImports from 'eslint-plugin-unused-imports'


// REF <-> /depot/PUBLIC/@nocke/syncdocs/eslint.config.js
// interesting REF: https://github.com/microsoft/vscode-eslint/blob/main/playgrounds/flat-config/eslint.config.js

export default [
  js.configs.recommended, // <=> „extends“
  {
    'files': [
      '**/*.js',
      '**/*.ts'
    ],
    // plugins: {
    //   unusedImports
    // },
    'languageOptions': {
      'sourceType': 'module',
      'globals': {
        ...globals.node,
        ...globals.mocha,
        ...globals.es6,
      }
    },
    'rules': {
      'semi': [
        'warn',
        'never',
        {
          'beforeStatementContinuationChars': 'always'
        }
      ],
      'no-tabs': 'error',
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single',
        {
          'allowTemplateLiterals': true,
          'avoidEscape': true
        }
      ],
      'no-lone-blocks': 'error',
      'sort-imports': [
        'error',
        // import group, import types (categories), but no alphabetic enforcement
        { 'ignoreDeclarationSort': true }
      ],
      'no-multi-spaces': 'warn',
      'max-statements-per-line': [
        'error',
        {
          'max': 2 // on my other projects it's 1 !
        }
      ],
      'space-before-function-paren': [
        'error',
        {
          'anonymous': 'never',
          'named': 'never',
          'asyncArrow': 'always'
        }
      ],
      'comma-dangle': 'off',
      'no-multiple-empty-lines': [
        'warn',
        {
          'max': 3,
          'maxBOF': 1,
          'maxEOF': 1
        }
      ],
      'import/no-named-as-default-member': 'off',
      'no-unused-vars': [
        'warn',
        {
          'vars': 'all',
          'args': 'none',
          'ignoreRestSiblings': true,
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_', // needed due to i.e. log.d.ts
        }
      ],
      'no-trailing-spaces': 'warn',
      // TODO review + remove, currently specific to util
      'padded-blocks': 'off',
      'no-extra-boolean-cast': 'off',
    } // rules
  },

  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        // fügt `autoSuiteName` für alle Dateien in `test/` als global hinzu
        autoSuiteName: 'readonly'
      }
    }
  }
]

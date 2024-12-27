module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    settings: {
      react: {
        version: '18.3', // Automatically detect the version of React
      },
    },
    rules: {
      // Add your custom rules here
      'react/react-in-jsx-scope': 'off', // Example rule
    },
  };
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['react', 'react-native'],
  rules: {
    // Disable unused styles rule - causes false positives with imported styles
    'react-native/no-unused-styles': 'off',
    
    // Keep other important rules enabled
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
};

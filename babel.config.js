module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {
      // This deals with "React is not defined" error. Pulled from React17 Documentation.
      "runtime": "automatic"
    }],
    '@babel/preset-modules', // Add this line for ESM support
    '@babel/preset-typescript', // Add this line if using TypeScript
  ]
};

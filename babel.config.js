module.exports = {
  presets: ['module:@react-native/babel-preset'],
   plugins: [
    // other plugins first (if any)
    'react-native-worklets/plugin', // must be last
  ],
};

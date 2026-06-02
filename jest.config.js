module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-linear-gradient|@testing-library|expo|expo-linear-gradient|expo-modules-core|@expo)/)',
  ],
};

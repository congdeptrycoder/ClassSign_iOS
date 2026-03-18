import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { LoginScreen } from './presentation/screens/Login/LoginScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

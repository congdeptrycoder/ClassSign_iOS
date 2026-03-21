import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginScreen } from './presentation/screens/Login/LoginScreen';
import { StudentDashboardScreen } from './presentation/screens/StudentDashboard/StudentDashboardScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'StudentDashboard'>('Login');

  const handleLoginSuccess = () => {
    setCurrentScreen('StudentDashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('Login');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'Login' ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <StudentDashboardScreen onLogout={handleLogout} />
      )}
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

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F7',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#1C1C1E' }]}>
          Hello Word
        </Text>

        <View style={[
          styles.searchContainer,
          { backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF' }
        ]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#1C1C1E' }]}
            placeholder="Search..."
            placeholderTextColor={isDarkMode ? '#EBEBF580' : '#8E8E93'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    // opacity for non-dark-mode is handled by the text color, but we can set fixed opacity
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
});

export default App;

import 'react-native-get-random-values';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { JobProvider } from './src/contexts/JobContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <JobProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </JobProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
});

export default App;
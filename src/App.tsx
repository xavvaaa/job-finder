import 'react-native-get-random-values';
import React from 'react';
import { SafeAreaView, Platform, StatusBar, StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { JobProvider } from './contexts/JobContext';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => (
  <ThemeProvider>
    <JobProvider>
      <SafeAreaView style={styles.container}>
        <AppNavigator />
      </SafeAreaView>
    </JobProvider>
  </ThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  }
});

export default App;
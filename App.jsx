import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme'; // adjust to match your theme folder

const App = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <RootNavigator />
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
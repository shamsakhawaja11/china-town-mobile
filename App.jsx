import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/components/context/AuthContext';
import { CartProvider } from './src/components/context/CartContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

const App = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export default App;
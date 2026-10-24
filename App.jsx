import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import AppButton from './src/components/common/AppButton';
import { AuthProvider, useAuth } from './src/components/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import { colors } from './src/theme'; // adjust to match your theme folder

const TempHome = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Logged in</Text>
      <AppButton title="Log out" onPress={logout} style={styles.logoutButton} />
    </View>
  );
};

const Root = () => {
  const { isRestoring, isAuthenticated } = useAuth();

  if (isRestoring) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <TempHome /> : <LoginScreen />;
};

const App = () => (
  <AuthProvider>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    <Root />
  </AuthProvider>
);

export default App;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  text: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  logoutButton: { marginTop: 24, alignSelf: 'stretch' },
});
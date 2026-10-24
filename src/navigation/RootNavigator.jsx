import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppButton from '../components/common/AppButton';
import { useAuth } from '../components/context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import { colors } from '../theme'; // adjust to match your theme folder

const Stack = createNativeStackNavigator();

// Temporary stand-in until the real Home screen exists.
const TempHome = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Logged in</Text>
      <AppButton title="Log out" onPress={logout} style={styles.logoutButton} />
    </View>
  );
};

const RootNavigator = () => {
  const { isRestoring, isAuthenticated } = useAuth();

  if (isRestoring) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={TempHome} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

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
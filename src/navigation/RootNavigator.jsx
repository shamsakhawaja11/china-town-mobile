import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, ShoppingBag, Star, User, UtensilsCrossed } from 'lucide-react-native';
import AppButton from '../components/common/AppButton';
import { useAuth } from '../components/context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MenuScreen from '../screens/menu/MenuScreen';
import RestaurantScreen from '../screens/restaurant/RestaurantScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ title }) => (
  <View style={styles.center}>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.subText}>Coming soon</Text>
  </View>
);

const SearchScreen = () => <PlaceholderScreen title="Search" />;
const OrdersScreen = () => <PlaceholderScreen title="Orders" />;
const ReviewsScreen = () => <PlaceholderScreen title="Reviews" />;

// Temporary profile: keeps a way to log out until the real screen exists.
const ProfileScreen = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Profile</Text>
      <AppButton title="Log out" onPress={logout} style={styles.logoutButton} />
    </View>
  );
};

const TAB_ICONS = {
  Home,
  Search,
  Menu: UtensilsCrossed,
  Orders: ShoppingBag,
  Reviews: Star,
  Profile: User,
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
      tabBarIcon: ({ color, size }) => {
        const Icon = TAB_ICONS[route.name];
        return <Icon size={size} color={color} strokeWidth={1.75} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={RestaurantScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Reviews" component={ReviewsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

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
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {isAuthenticated ? (
          // Screens that sit ABOVE the tabs (Map, BookTable, ...) get added here later.
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
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
  subText: { marginTop: 6, fontSize: 14, color: colors.textMuted },
  logoutButton: { marginTop: 24, alignSelf: 'stretch' },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tabLabel: { fontSize: 11, fontWeight: '600' },
});
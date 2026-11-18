import { Platform } from 'react-native';

// Development: which machine the app is running on decides the host.
const DEV_PORT = 3000; // change if your Nest app uses another port
const PHYSICAL_DEVICE_IP = '192.168.1.100'; // your computer's LAN IP; used only on a real phone

// Set to true when testing on a real phone instead of an emulator/simulator.
const USE_PHYSICAL_DEVICE = false;

const DEV_HOST = USE_PHYSICAL_DEVICE
  ? PHYSICAL_DEVICE_IP
  : Platform.select({
      android: '10.0.2.2', // Android emulator's alias for your computer
      ios: 'localhost', // iOS simulator shares your computer's network
    });

// Server address WITHOUT any path. Photos live at <SERVER_URL>/uploads/...,
// while API calls live at <SERVER_URL>/api/v1/...
const DEV_SERVER_URL = `http://${DEV_HOST}:${DEV_PORT}`;

// Production: placeholder until the backend is deployed behind HTTPS.
const PROD_SERVER_URL = 'https://api.chinatown.example.com';

// __DEV__ is a global provided by React Native: true in debug, false in release builds.
export const SERVER_URL = __DEV__ ? DEV_SERVER_URL : PROD_SERVER_URL;

// Derived from SERVER_URL so the two can never disagree.
export const API_BASE_URL = `${SERVER_URL}/api/v1`;
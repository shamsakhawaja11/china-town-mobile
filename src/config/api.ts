import { Platform } from 'react-native';

// --- Edit these to match your NestJS backend (check main.ts) ---
const PORT = 3000;
const API_PREFIX = '/api/v1'; // setGlobalPrefix + versioning; use '' if you have neither

// --- Real phone testing: set to true and put your computer's Wi-Fi address here ---
const USE_REAL_DEVICE = false;
const LAN_IP = '192.168.1.10';

const emulatorHost = Platform.select({
  android: '10.0.2.2', // Android emulator's alias for your computer
  ios: 'localhost',
  default: 'localhost',
});

const devHost = USE_REAL_DEVICE ? LAN_IP : emulatorHost;

const DEV_URL = `http://${devHost}:${PORT}${API_PREFIX}`;
const PROD_URL = 'https://api.example.com/api/v1'; // placeholder until deployment

export const API_BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

export const REQUEST_TIMEOUT_MS = 15000;    
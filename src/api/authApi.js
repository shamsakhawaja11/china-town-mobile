import { Platform } from 'react-native';
import client from './client';


export const login = async ({ contact, password }) => {
  const { data } = await client.post('/auth/login', {
    contact,
    password,
    deviceInfo: `${Platform.OS} ${Platform.Version}`,
  });
  return data;
};
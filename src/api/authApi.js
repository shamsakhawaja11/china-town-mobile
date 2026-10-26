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

export const register = async ({ name, email, phone, password }) => {
  const body = { name, password };
  if (email) body.email = email;
  if (phone) body.phone = phone;

  const { data } = await client.post('/auth/register', body);
  return data;
};
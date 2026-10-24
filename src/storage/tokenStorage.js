import * as Keychain from 'react-native-keychain';

const SERVICE = 'chinatown.auth';

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await Keychain.setGenericPassword(
    'tokens', 
    JSON.stringify({ accessToken, refreshToken }),
    { service: SERVICE },
  );
};

export const getTokens = async () => {
  const result = await Keychain.getGenericPassword({ service: SERVICE });
  if (!result) return null;

  try {
    return JSON.parse(result.password);
  } catch {
    return null; 
  }
};

export const clearTokens = async () => {
  await Keychain.resetGenericPassword({ service: SERVICE });
};
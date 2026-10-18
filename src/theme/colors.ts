export const colors = {
  background: '#EEE3DD',
  surface: '#FFFFFF',

  primary: '#D93B30',
  primaryPressed: '#B82F25',
  primaryDark: '#8F1D16',

  gold: '#E6B450',

  textPrimary: '#2B1B17',
  textSecondary: '#8A7A74',

  border: '#E2D3CC',

  success: '#2E9E5B',
  error: '#C62828',

  heroOverlay: 'rgba(255, 255, 255, 0.12)',

  black: '#000000',
  white: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;
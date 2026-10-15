export const colors = {
  background: '#EEE3DD',
  surface: '#FFFFFF',

  primary: '#D93B30',
  primaryPressed: '#B82F25',

  textPrimary: '#2B1B17',
  textSecondary: '#8A7A74',

  border: '#E2D3CC',

  success: '#2E9E5B',
  error: '#C62828',

  black: '#000000',
  white: '#FFFFFF',
} as const;

export type ColorName = keyof typeof colors;
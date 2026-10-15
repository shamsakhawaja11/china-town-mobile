import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.display,
    lineHeight: 40,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    lineHeight: 34,
  },
  heading: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    lineHeight: 28,
  },
  subheading: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.lg,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyKey = keyof typeof typography;
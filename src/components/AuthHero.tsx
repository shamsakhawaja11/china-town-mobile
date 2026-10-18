import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from './BrandMark';
import { colors, spacing, typography } from '../theme';

// How far the cream card slides up over the hero. LoginScreen imports this too.
export const HERO_OVERLAP = spacing.xxl;

// Neutral black scrim (no color) so white text stays readable over the photo.
// Delete the <LinearGradient> below if you want no overlay at all.
const SCRIM_TOP = 'rgba(0, 0, 0, 0.15)';
const SCRIM_BOTTOM = 'rgba(0, 0, 0, 0.5)';

const TEXT_SHADOW = 'rgba(0, 0, 0, 0.55)';

export function AuthHero() {
  return (
    <ImageBackground
      source={require('../assets/images/hero-restaurant.jpg')}
      resizeMode="cover"
      style={styles.root}
      accessibilityIgnoresInvertColors
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[SCRIM_TOP, SCRIM_BOTTOM]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top']} style={styles.content}>
        <BrandMark size={100} />
        <Text style={styles.brand} accessibilityRole="header">
          China Town
        </Text>
        <Text style={styles.tagline}>Szechuan · Cantonese · Fine Dining</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: HERO_OVERLAP + spacing.xl,
  },
  brand: {
    ...typography.display,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.lg,
    textShadowColor: TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  tagline: {
    ...typography.caption,
    color: colors.gold,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: spacing.xs,
    textShadowColor: TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
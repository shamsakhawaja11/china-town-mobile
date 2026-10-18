import React from 'react';
import {
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UtensilsCrossed } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

// How far the cream card slides up over the hero. LoginScreen imports this too.
export const HERO_OVERLAP = spacing.xxl;

// 8-digit hex = color + alpha (last two digits). C7 is about 78%, F2 about 95%.
// Lighter at the top so the photo shows, stronger at the bottom for the text.
const TINT_TOP = `${colors.primary}C7`;
const TINT_BOTTOM = `${colors.primaryDark}F2`;

export function AuthHero() {
  return (
    <ImageBackground
      source={require('../assets/images/hero-restaurant.jpg')}
      resizeMode="cover"
      style={styles.root}
      accessibilityIgnoresInvertColors
    >
      <StatusBar barStyle="light-content" />

      {/* Brand tint over the photo, so the text stays readable */}
      <LinearGradient
        colors={[TINT_TOP, TINT_BOTTOM]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Decorative circles: before the content, so the content draws on top */}
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        style={[styles.circle, styles.circleLarge]}
      />
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        style={[styles.circle, styles.circleMedium]}
      />

      <SafeAreaView edges={['top']} style={styles.content}>
        <View style={styles.logoRing}>
          <UtensilsCrossed size={34} color={colors.primary} />
        </View>
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
  circle: {
    position: 'absolute',
    backgroundColor: colors.heroOverlay,
  },
  circleLarge: {
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -70,
    right: -60,
  },
  circleMedium: {
    width: 150,
    height: 150,
    borderRadius: 75,
    top: 120,
    left: -55,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: HERO_OVERLAP + spacing.xl,
  },
  logoRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    ...typography.display,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  tagline: {
    ...typography.caption,
    color: colors.gold,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
});
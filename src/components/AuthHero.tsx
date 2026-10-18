import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UtensilsCrossed } from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';

// How far the cream card slides up over the hero. LoginScreen imports this too.
export const HERO_OVERLAP = spacing.xxl;

export function AuthHero() {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <StatusBar
        barStyle="light-content"
      />

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
      <View
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        style={[styles.circle, styles.circleSmall]}
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
    </LinearGradient>
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
    width: 160,
    height: 160,
    borderRadius: 80,
    top: 110,
    left: -50,
  },
  circleSmall: {
    width: 110,
    height: 110,
    borderRadius: 55,
    bottom: 40,
    right: 30,
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
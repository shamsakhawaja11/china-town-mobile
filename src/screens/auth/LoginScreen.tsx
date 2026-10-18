import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Mail } from 'lucide-react-native';
import { AppButton } from '../../components/AppButton';
import { AppTextField } from '../../components/AppTextField';
import { AuthHero, HERO_OVERLAP } from '../../components/AuthHero';
import { FadeInView } from '../../components/FadeInView';
import { colors, fontFamily, radius, spacing, typography } from '../../theme';

// Each block of the card starts this many ms after the one above it.
const STAGGER_MS = 80;
const delayFor = (index: number) => index * STAGGER_MS;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');

  // Temporary rule. The real validation comes with the form-state step.
  const emailError =
    email.length > 0 && !email.includes('@')
      ? 'Enter a valid email address'
      : undefined;

  const handleLogin = () => console.log('Sign In');
  const handleForgotPassword = () => console.log('Forgot password');
  const handleCreateAccount = () => console.log('Create account');
  const handleGoogle = () => console.log('Google');
  const handleApple = () => console.log('Apple');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        <AuthHero />

        <View
          style={[
            styles.card,
            { paddingBottom: spacing.xxl + insets.bottom },
          ]}
        >
          <FadeInView delay={delayFor(0)} style={styles.heading}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to China Town
            </Text>
          </FadeInView>

          <FadeInView delay={delayFor(1)}>
            <AppTextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              placeholder="ayesha@example.com"
              leftIcon={<Mail size={20} color={colors.textSecondary} />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </FadeInView>

          <FadeInView delay={delayFor(2)}>
            <AppTextField
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock size={20} color={colors.textSecondary} />}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
            />
          </FadeInView>

          <FadeInView delay={delayFor(3)}>
            <Pressable
              style={styles.forgot}
              onPress={handleForgotPassword}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              style={styles.signInButton}
            />
          </FadeInView>

          <FadeInView delay={delayFor(4)}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.link} onPress={handleCreateAccount}>
                Create account
              </Text>
            </Text>
          </FadeInView>

          <FadeInView delay={delayFor(5)}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socials}>
              <AppButton
                variant="outline"
                title="Continue with Google"
                onPress={handleGoogle}
              />
              <AppButton
                variant="dark"
                title="Continue with Apple"
                onPress={handleApple}
              />
            </View>
          </FadeInView>

          <FadeInView delay={delayFor(6)}>
            <Text style={styles.terms}>
              By continuing you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    flexGrow: 1,
    marginTop: -HERO_OVERLAP,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  heading: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    ...typography.label,
    color: colors.primary,
  },
  signInButton: {
    marginTop: spacing.lg,
  },
  signupText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  link: {
    fontFamily: fontFamily.semibold,
    color: colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
  socials: {
    gap: spacing.md,
  },
  terms: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  termsLink: {
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
});
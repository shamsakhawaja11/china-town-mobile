import React, { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Eye, EyeOff, Lock, Mail, UtensilsCrossed } from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import AppTextInput from '../../components/common/AppTextInput';
import { useAuth } from '../../components/context/AuthContext';
import { colors } from '../../theme';

// Multicolor Google "G" (lucide has no brand icons)
const GoogleLogo = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const passwordRef = useRef(null);

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const errors = {};
    if (!contact.trim()) errors.contact = 'Enter your email';
    if (!password) errors.password = 'Enter your password';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ contact: contact.trim(), password });
      // Success: AuthContext flips isAuthenticated and the navigator swaps screens.
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // TODO: Google Sign-In needs an external service + backend endpoint. UI only for now.
  };

  const handleGuest = () => {
    // Adjust the route name to match your RootNavigator.
    navigation?.navigate('Menu');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue to China Town</Text>

        {formError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        ) : null}

        <AppTextInput
          label="Email"
          placeholder="ayesha@example.com"
          value={contact}
          onChangeText={setContact}
          error={fieldErrors.contact}
          leftIcon={<Mail size={20} color={colors.textMuted} strokeWidth={1.75} />}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AppTextInput
          ref={passwordRef}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          leftIcon={<Lock size={20} color={colors.textMuted} strokeWidth={1.75} />}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          rightElement={
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Eye size={20} color={colors.textMuted} strokeWidth={1.75} />
              ) : (
                <EyeOff size={20} color={colors.textMuted} strokeWidth={1.75} />
              )}
            </Pressable>
          }
        />

        <Pressable
          style={styles.forgotLink}
          hitSlop={8}
          onPress={() => navigation?.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <AppButton title="Sign In" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <Pressable onPress={() => navigation?.navigate('Register')}>
            <Text style={styles.footerLink}>Create account</Text>
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            styles.googleButton,
            pressed && styles.pressed,
          ]}
          onPress={handleGoogle}
          accessibilityRole="button"
          accessibilityLabel="Continue with Google"
        >
          <GoogleLogo />
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            styles.guestButton,
            pressed && styles.pressed,
          ]}
          onPress={handleGuest}
          accessibilityRole="button"
          accessibilityLabel="Browse menu as guest"
        >
          <UtensilsCrossed size={20} color="#FFFFFF" strokeWidth={1.75} />
          <Text style={styles.guestText}>Browse menu as guest</Text>
        </Pressable>

        <View style={styles.termsWrap}>
          <Text style={styles.termsText}>By continuing you agree with </Text>
          <Pressable onPress={() => navigation?.navigate('Terms')}>
            <Text style={styles.termsLink}>Terms of Service &amp; Privacy Policy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    width: 88,
    height: 88,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: colors.errorBackground,
  },
  errorBannerText: { fontSize: 13, color: colors.error },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 20,
  },
  forgotText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: colors.textMuted,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  guestButton: { backgroundColor: '#000000' },
  guestText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  pressed: { opacity: 0.85 },
  termsWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  termsText: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  termsLink: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 2,
  },
});
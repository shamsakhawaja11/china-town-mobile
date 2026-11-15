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
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import AppTextInput from '../../components/common/AppTextInput';
import { useAuth } from '../../components/context/AuthContext';
import { colors } from '../../theme';

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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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

        <AppButton title="Sign In" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account? </Text>
          <Pressable onPress={() => navigation?.navigate('Register')}>
            <Text style={styles.footerLink}>Create account</Text>
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
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
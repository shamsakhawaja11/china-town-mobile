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
import AppButton from '../../components/common/AppButton';
import AppTextInput from '../../components/common/AppTextInput';
import { useAuth } from '../../components/context/AuthContext';
import { colors } from '../../theme'; // adjust to match your theme folder

const logo = require('../../assets/images/logo.png'); // adjust to your pagoda logo path

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
    if (!contact.trim()) errors.contact = 'Enter your email or phone number';
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
      // Success: AuthContext flips isAuthenticated, and the root navigator
      // (set up later) swaps this screen for the app. Nothing to do here.
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
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
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {formError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        ) : null}

        <AppTextInput
          label="Email or phone"
          placeholder="Enter your email or phone"
          value={contact}
          onChangeText={setContact}
          error={fieldErrors.contact}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
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
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          rightElement={
            <Pressable onPress={() => setShowPassword((prev) => !prev)} hitSlop={8}>
              <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          }
        />

        <AppButton title="Sign in" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
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
  logo: { width: 96, height: 96, alignSelf: 'center', marginBottom: 24 },
  title: {
    fontSize: 26,
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
  toggle: { fontSize: 13, fontWeight: '600', color: colors.primary },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
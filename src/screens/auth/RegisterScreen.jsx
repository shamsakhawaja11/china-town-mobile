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
import { Check, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import AppTextInput from '../../components/common/AppTextInput';
import { useAuth } from '../../components/context/AuthContext';
import { colors } from '../../theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Same shapes your backend normalizeContact() accepts: 03xx..., 0092..., 92..., +92...
const PHONE_REGEX = /^(?:\+92|0092|92|0)\d{10}$/;

// Returns { level: 0-3, hint }
const getPasswordStrength = (password) => {
  if (!password) return { level: 0, hint: '' };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score += 1;
  if (hasLower && hasUpper) score += 1;
  if (hasDigit) score += 1;
  if (hasSymbol) score += 1;

  if (password.length < 8) return { level: 1, hint: 'Weak — use at least 8 characters' };
  if (score <= 2) return { level: 1, hint: 'Weak — mix letters, numbers and symbols' };
  if (score === 3) return { level: 2, hint: 'Good — add a symbol for a stronger password' };
  return { level: 3, hint: 'Strong password' };
};

const SEGMENT_COLORS = { 1: '#E0483B', 2: '#3FA06A', 3: '#3FA06A' };

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'Required';
    if (!lastName.trim()) errors.lastName = 'Required';

    if (!email.trim()) errors.email = 'Enter your email';
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email';

    // Phone is optional here; if filled it must look valid.
    const cleanPhone = phone.replace(/[\s()-]/g, '');
    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      errors.phone = 'Enter a valid Pakistani number';
    }

    if (!password) errors.password = 'Create a password';
    else if (password.length < 8) errors.password = 'At least 8 characters';

    if (!confirm) errors.confirm = 'Re-enter your password';
    else if (confirm !== password) errors.confirm = 'Passwords do not match';

    if (!agreed) errors.terms = 'Please accept the terms to continue';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
      });
      // Success: register() also logs in, AuthContext flips isAuthenticated,
      // and the navigator swaps screens. Nothing to do here.
    } catch (err) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const eyeButton = (visible, toggle, label) => (
    <Pressable
      onPress={toggle}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}
    >
      {visible ? (
        <Eye size={20} color={colors.textMuted} strokeWidth={1.75} />
      ) : (
        <EyeOff size={20} color={colors.textMuted} strokeWidth={1.75} />
      )}
    </Pressable>
  );

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

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join China Town for faster ordering</Text>

        {formError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{formError}</Text>
          </View>
        ) : null}

        <View style={styles.nameRow}>
          <View style={styles.nameCol}>
            <AppTextInput
              label="First name"
              placeholder="Ayesha"
              value={firstName}
              onChangeText={setFirstName}
              error={fieldErrors.firstName}
              leftIcon={<User size={20} color={colors.textMuted} strokeWidth={1.75} />}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
          </View>
          <View style={styles.nameCol}>
            <AppTextInput
              ref={lastNameRef}
              label="Last name"
              placeholder="Malik"
              value={lastName}
              onChangeText={setLastName}
              error={fieldErrors.lastName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          </View>
        </View>

        <AppTextInput
          ref={emailRef}
          label="Email"
          placeholder="ayesha@example.com"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          leftIcon={<Mail size={20} color={colors.textMuted} strokeWidth={1.75} />}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        <AppTextInput
          ref={phoneRef}
          label="Phone number"
          placeholder="03325005598"
          value={phone}
          onChangeText={setPhone}
          error={fieldErrors.phone}
          leftIcon={<Phone size={20} color={colors.textMuted} strokeWidth={1.75} />}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <AppTextInput
          ref={passwordRef}
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          leftIcon={<Lock size={20} color={colors.textMuted} strokeWidth={1.75} />}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          rightElement={eyeButton(showPassword, () => setShowPassword((p) => !p), 'password')}
        />

        {password ? (
          <View style={styles.strengthWrap}>
            <View style={styles.strengthRow}>
              {[1, 2, 3].map((segment) => (
                <View
                  key={segment}
                  style={[
                    styles.segment,
                    {
                      backgroundColor:
                        strength.level >= segment
                          ? SEGMENT_COLORS[strength.level]
                          : colors.border,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.strengthHint}>{strength.hint}</Text>
          </View>
        ) : null}

        <AppTextInput
          ref={confirmRef}
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirm}
          onChangeText={setConfirm}
          error={fieldErrors.confirm}
          leftIcon={<Lock size={20} color={colors.textMuted} strokeWidth={1.75} />}
          secureTextEntry={!showConfirm}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          rightElement={eyeButton(showConfirm, () => setShowConfirm((p) => !p), 'password')}
        />

        <Pressable
          style={styles.termsRow}
          onPress={() => setAgreed((prev) => !prev)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <Check size={14} color="#FFFFFF" strokeWidth={3} /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>, and I’m okay with
            receiving order updates by email.
          </Text>
        </Pressable>
        {fieldErrors.terms ? (
          <Text style={styles.termsError}>{fieldErrors.terms}</Text>
        ) : null}

        <AppButton title="Create account" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => navigation?.navigate('Login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: colors.errorBackground,
  },
  errorBannerText: { fontSize: 13, color: colors.error },
  nameRow: { flexDirection: 'row', gap: 12 },
  nameCol: { flex: 1 },
  strengthWrap: { marginTop: -8, marginBottom: 16 },
  strengthRow: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 4, borderRadius: 2 },
  strengthHint: { marginTop: 6, fontSize: 12, color: colors.textMuted },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textMuted },
  termsLink: { color: colors.primary, fontWeight: '500' },
  termsError: { fontSize: 12, color: colors.error, marginBottom: 8 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: { fontSize: 14, color: colors.textMuted },
  footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme';

const AppTextInput = forwardRef(
  (
    { label, error, leftIcon, rightElement, onFocus, onBlur, style, ...inputProps },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View
          style={[
            styles.field,
            isFocused && styles.fieldFocused,
            error && styles.fieldError,
          ]}
        >
          {/* Any element works here: an icon, an emoji, a small View, etc. */}
          {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={label}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...inputProps}
          />

          {rightElement}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  },
);

AppTextInput.displayName = 'AppTextInput';

export default AppTextInput;

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: colors.error },
  leftIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, padding: 0 },
  error: { marginTop: 4, fontSize: 12, color: colors.error },
});
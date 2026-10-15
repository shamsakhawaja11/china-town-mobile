import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'outline' | 'dark';

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: Variant;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variants = {
    primary: {
        bg: colors.primary,
        bgPressed: colors.primaryPressed,
        text: colors.white,
        border: 'transparent',
        spinner: colors.white,
    },
    outline: {
        bg: colors.white,
        bgPressed: colors.background,
        text: colors.textPrimary,
        border: colors.border,
        spinner: colors.textPrimary,
    },
    dark: {
        bg: colors.black,
        bgPressed: '#2A2A2A',
        text: colors.white,
        border: 'transparent',
        spinner: colors.white,
    },
} as const;

export function AppButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    leftIcon,
    style,
}: AppButtonProps) {
    const v = variants[variant];
    const progress = useSharedValue(0);
    const isInactive = disabled || loading;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(progress.value, [0, 1], [1, 0.97]) }],
        backgroundColor: interpolateColor(progress.value, [0, 1], [v.bg, v.bgPressed]),
    }));

    return (
        <AnimatedPressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isInactive, busy: loading }}
            disabled={isInactive}
            onPress={onPress}
            onPressIn={() => {
                progress.value = withTiming(1, { duration: 100 });
            }}
            onPressOut={() => {
                progress.value = withTiming(0, { duration: 160 });
            }}
            style={[
                styles.base,
                { borderColor: v.border },
                disabled && styles.disabled,
                animatedStyle,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={v.spinner} />
            ) : (
                <View style={styles.content}>
                    {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
                    <Text style={[typography.button, { color: v.text }]}>{title}</Text>
                </View>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minHeight: 52,
        borderRadius: radius.md,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: spacing.sm,
    },
    disabled: {
        opacity: 0.5,
    },
});
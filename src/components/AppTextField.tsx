import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, radius, spacing, typography } from "../theme";

interface AppTextFieldProps extends TextInputProps {
    label: string
    error?: string
    leftIcon?: React.ReactNode
}

export function AppTextField({ label, error, leftIcon, ...rest }: AppTextFieldProps) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const focus = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                focus.value, [0, 1], [colors.border, colors.primary]
            ),
        };
    });

    const handleFocus = (e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) => {
        focus.value = withTiming(1, { duration: 150 })
        rest.onFocus?.(e)
    }

    const handleBlur = (e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0]) => {
        focus.value = withTiming(0, { duration: 150 })
        rest.onBlur?.(e)
    }
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <Animated.View>
                <TextInput style={styles.input}/>
            </Animated.View>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        color: colors.textPrimary,
        marginBottom: spacing.xs
    },
    box: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 32,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
    },
    input: {
        flex:1,
        ...typography.body,
        color:colors.textPrimary
    }

});

// const styles = StyleSheet.create({ wrapper, label, box, input, error })


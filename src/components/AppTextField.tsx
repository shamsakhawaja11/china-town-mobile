import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, radius, spacing, typography } from "../theme";
import { Eye, EyeOff } from "lucide-react-native";
interface AppTextFieldProps extends TextInputProps {
    label: string
    error?: string
    leftIcon?: React.ReactNode
}

export function AppTextField({ label, error, leftIcon,secureTextEntry, ...rest }: AppTextFieldProps) {

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
            <Animated.View style={[styles.box, animatedStyle]}>
                {leftIcon ? <View style={{ marginRight: spacing.sm }}>{leftIcon}</View> : null}

                <TextInput style={styles.input}
                    {...rest}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor={colors.textSecondary}
                    accessibilityLabel="{label}"
                />
                {
                    secureTextEntry ? (
                        <Pressable style={styles.eye} onPress={() => setIsPasswordVisible((prev) => !prev)}
                            hitSlop={12}
                            accessibilityRole='button'
                            accessibilityLabel={
                                isPasswordVisible ? "Hide Password" : "Show Password"
                            }
                            >
                        {
                            isPasswordVisible ? (
                                <Eye size={20} color={colors.textSecondary}/>
                            ):(
                                <EyeOff size={20} color={colors.textSecondary}/>
                            )
                        }
                        </Pressable>
                    ):null
                }
            </Animated.View>
        </View>
    );
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
        height: 52,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary
    },
    eye:{
        marginLeft:spacing.sm
    }

});



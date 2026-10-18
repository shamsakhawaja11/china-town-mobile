import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({ children, delay = 0, style }: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
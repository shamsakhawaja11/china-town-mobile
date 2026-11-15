import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

// Small white card with a bold title and a muted subtitle.
// Used for "Open now / Until 11:30 PM" and "15 tables / Indoor seating".
const InfoChip = ({ title, subtitle, titleColor, style }) => (
  <View style={[styles.chip, style]}>
    <Text
      style={[styles.title, titleColor ? { color: titleColor } : null]}
      numberOfLines={1}
    >
      {title}
    </Text>
    {subtitle ? (
      <Text style={styles.subtitle} numberOfLines={1}>
        {subtitle}
      </Text>
    ) : null}
  </View>
);

export default InfoChip;

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: colors.surface,
    // Soft shadow: iOS uses shadow*, Android uses elevation.
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
  },
});
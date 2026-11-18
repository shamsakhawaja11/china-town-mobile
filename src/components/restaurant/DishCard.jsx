import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatPrice } from '../../utils/formatPrice';
import { colors } from '../../theme';

const DishCard = ({ item, onPress, style }) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    onPress={() => onPress?.(item)}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${formatPrice(item.price)}`}
  >
    {item.image_url ? (
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
    ) : (
      // Neutral box when a dish has no photo yet
      <View style={[styles.image, styles.imagePlaceholder]} />
    )}

    <Text style={styles.name} numberOfLines={2}>
      {item.name}
    </Text>
    <Text style={styles.price}>{formatPrice(item.price)}</Text>
  </Pressable>
);

export default DishCard;

const styles = StyleSheet.create({
  card: { width: '100%' },
  pressed: { opacity: 0.85 },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
  imagePlaceholder: { backgroundColor: colors.border },
  name: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  price: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
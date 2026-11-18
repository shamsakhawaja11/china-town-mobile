import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Star } from 'lucide-react-native';
import { colors } from '../../theme';

const SERVES_GREEN = '#2E9E5B';
const STAR_AMBER = '#F5A623';

const formatPrice = (price) => {
    const value = Number(price);
    if (Number.isNaN(value)) return '';
    const fixed = Number.isInteger(value) ? String(value) : value.toFixed(2);
    const [whole, decimals] = fixed.split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `Rs ${decimals ? `${grouped}.${decimals}` : grouped}`;
};

const pick = (item, snake, camel) => item[snake] ?? item[camel];

const MenuItemRow = ({ item, onPress, onAdd }) => {
    const imageUrl = pick(item, 'image_url', 'imageUrl');
    const rating = Number(pick(item, 'avg_rating', 'avgRating'));
    const reviewCount = Number(pick(item, 'review_count', 'reviewCount')) || 0;
    const servesCount = Number(pick(item, 'serves_count', 'servesCount')) || 0;

    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() => onPress?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${formatPrice(item.price)}`}
        >
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, styles.imagePlaceholder]} />
            )}

            <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                </Text>

                {item.description ? (
                    <Text style={styles.description} numberOfLines={1}>
                        {item.description}
                    </Text>
                ) : null}

                {/* avg_rating defaults to 0, so only show a rating once there are reviews */}
                {reviewCount > 0 && !Number.isNaN(rating) ? (
                    <View style={styles.ratingRow}>
                        <Star
                            size={13}
                            color={STAR_AMBER}
                            fill={STAR_AMBER}
                            strokeWidth={1.5}
                        />
                        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                        <Text style={styles.reviews}>
                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                        </Text>
                    </View>
                ) : null}

                {servesCount > 0 ? (
                    <Text style={styles.serves}>
                        serves {servesCount} {servesCount === 1 ? 'person' : 'people'}
                    </Text>
                ) : null}

                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <Pressable
                        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
                        onPress={() => onAdd?.(item)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${item.name} to cart`}
                    >
                        <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

export default MenuItemRow;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    pressed: { opacity: 0.85 },
    image: { width: 76, height: 76, borderRadius: 12 },
    imagePlaceholder: { backgroundColor: colors.border },
    body: { flex: 1, marginLeft: 12 },
    name: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
    description: { marginTop: 2, fontSize: 12, color: colors.textMuted },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    rating: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
    reviews: { fontSize: 12, color: colors.textMuted },
    serves: { marginTop: 2, fontSize: 12, color: SERVES_GREEN },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    price: { fontSize: 16, fontWeight: '700', color: colors.primary },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
});
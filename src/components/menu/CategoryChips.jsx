import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

const CategoryChips = ({ categories = [], selectedId = null, onSelect }) => {
    const chips = [{ id: null, name: 'All' }, ...categories];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
            keyboardShouldPersistTaps="handled"
        >
            {chips.map((chip) => {
                const active = chip.id === selectedId;
                return (
                    <Pressable
                        key={chip.id ?? 'all'}
                        style={({ pressed }) => [
                            styles.chip,
                            active && styles.chipActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={() => onSelect?.(chip.id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={`${chip.name} category`}
                    >
                        <Text style={[styles.label, active && styles.labelActive]}>
                            {chip.name}
                        </Text>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};

export default CategoryChips;

const styles = StyleSheet.create({
    row: { gap: 10, paddingRight: 8 },
    chip: {
        height: 38,
        paddingHorizontal: 18,
        borderRadius: 19,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
    labelActive: { color: '#FFFFFF', fontWeight: '600' },
    pressed: { opacity: 0.85 },
});
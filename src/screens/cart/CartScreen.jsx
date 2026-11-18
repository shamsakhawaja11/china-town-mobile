import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import { useCart } from '../../components/context/CartContext';
import { formatPrice } from '../../utils/formatPrice';
import { colors } from '../../theme';

const CartLine = ({ line, onIncrement, onDecrement, onRemove }) => {
  const { item, quantity } = line;
  const imageUrl = item.image_url ?? item.imageUrl;
  const lineTotal = Number(item.price) * quantity;

  return (
    <View style={styles.line}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}

      <View style={styles.lineBody}>
        <View style={styles.lineTop}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable
            onPress={() => onRemove(item.id)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name} from cart`}
          >
            <Trash2 size={18} color={colors.textMuted} strokeWidth={1.75} />
          </Pressable>
        </View>

        <Text style={styles.unitPrice}>{formatPrice(item.price)} each</Text>

        <View style={styles.lineBottom}>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepButton}
              onPress={() => onDecrement(item.id)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`Decrease ${item.name}`}
            >
              <Minus size={16} color={colors.textPrimary} strokeWidth={2.25} />
            </Pressable>
            <Text style={styles.quantity}>{quantity}</Text>
            <Pressable
              style={styles.stepButton}
              onPress={() => onIncrement(item)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`Increase ${item.name}`}
            >
              <Plus size={16} color={colors.textPrimary} strokeWidth={2.25} />
            </Pressable>
          </View>

          <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { lines, itemCount, subtotal, addItem, decrementItem, removeItem, clearCart } =
    useCart();

  const handleBack = () => {
    if (navigation?.canGoBack()) navigation.goBack();
  };

  const handleClear = () => {
    Alert.alert('Clear cart', 'Remove all dishes from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  const handleCheckout = () => {
    // TODO: send the cart to the orders endpoint once the orders phase exists.
    Alert.alert(
      'Checkout',
      'Ordering will be available once the orders feature is built.',
    );
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>

        <Text style={styles.title}>Your cart</Text>

        {lines.length > 0 ? (
          <Pressable onPress={handleClear} hitSlop={8} accessibilityRole="button">
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {lines.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add a few dishes from the menu.</Text>
          <AppButton title="Browse menu" onPress={handleBack} style={styles.browse} />
        </View>
      ) : (
        <>
          <FlatList
            data={lines}
            keyExtractor={(line) => line.item.id}
            renderItem={({ item: line }) => (
              <CartLine
                line={line}
                onIncrement={addItem}
                onDecrement={decrementItem}
                onRemove={removeItem}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Text>
              <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
            </View>
            <Text style={styles.taxNote}>Taxes are calculated at checkout.</Text>
            <AppButton title="Checkout" onPress={handleCheckout} style={styles.checkout} />
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  clearText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  headerSpacer: { width: 40 },

  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  separator: { height: 12 },

  line: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  image: { width: 72, height: 72, borderRadius: 12 },
  imagePlaceholder: { backgroundColor: colors.border },
  lineBody: { flex: 1, marginLeft: 12 },
  lineTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  unitPrice: { marginTop: 2, fontSize: 12, color: colors.textMuted },
  lineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lineTotal: { fontSize: 15, fontWeight: '700', color: colors.primary },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 14, color: colors.textMuted },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  taxNote: { marginTop: 4, fontSize: 12, color: colors.textMuted },
  checkout: { marginTop: 14 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: { marginTop: 6, fontSize: 14, color: colors.textMuted },
  browse: { marginTop: 24, alignSelf: 'stretch' },
});
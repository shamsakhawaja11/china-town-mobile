import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Search, ShoppingCart } from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import AppTextInput from '../../components/common/AppTextInput';
import { useCart } from '../../components/context/CartContext';
import CategoryChips from '../../components/menu/CategoryChips';
import MenuItemRow from '../../components/menu/MenuItemRow';
import { getMenuCategories, getMenuItems } from '../../api/menuApi';
import { colors } from '../../theme';

const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 400;

const MenuScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addItem, itemCount } = useCart();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Only the newest request may update the screen (avoids out-of-order responses).
  const requestId = useRef(0);

  // Wait until the user stops typing before calling the backend.
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DELAY_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  // Categories load once. A failure just leaves "All" as the only chip.
  useEffect(() => {
    const run = async () => {
      try {
        const data = await getMenuCategories();
        const list = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    };
    run();
  }, []);

  // mode: 'reset' (spinner, replace), 'refresh' (pull-down, replace), 'more' (append)
  const load = useCallback(
    async ({ pageNumber, mode }) => {
      const id = ++requestId.current;
      if (mode === 'reset') setLoading(true);
      if (mode === 'more') setLoadingMore(true);
      setError('');

      try {
        // Unused filters must be undefined, never '': the backend rejects empty
        // search and categoryId values.
        const data = await getMenuItems({
          page: pageNumber,
          limit: PAGE_SIZE,
          categoryId: categoryId ?? undefined,
          search: debouncedSearch || undefined,
          sortBy: 'rating',
          order: 'desc',
        });
        if (id !== requestId.current) return;

        const fetched = data.items ?? [];
        setItems((prev) => (mode === 'more' ? [...prev, ...fetched] : fetched));
        setTotal(data.total ?? fetched.length);
        setPage(pageNumber);
        setHasNextPage(Boolean(data.hasNextPage));
      } catch (err) {
        if (id !== requestId.current) return;
        setError(err.message || 'Could not load the menu');
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [categoryId, debouncedSearch],
  );

  // Runs on first render and again whenever the search text or category changes.
  useEffect(() => {
    load({ pageNumber: 1, mode: 'reset' });
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load({ pageNumber: 1, mode: 'refresh' });
  };

  const onEndReached = () => {
    if (loading || loadingMore || refreshing || !hasNextPage) return;
    load({ pageNumber: page + 1, mode: 'more' });
  };

  const isFiltered = Boolean(debouncedSearch) || categoryId !== null;

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.state}>
          <Text style={styles.stateText}>{error}</Text>
          <AppButton
            title="Try again"
            onPress={() => load({ pageNumber: 1, mode: 'reset' })}
            style={styles.retry}
          />
        </View>
      );
    }
    return (
      <View style={styles.state}>
        <Text style={styles.stateTitle}>No dishes found</Text>
        <Text style={styles.stateText}>
          {isFiltered
            ? 'Try a different search or category.'
            : 'The menu is empty right now.'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.flex, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.primary} strokeWidth={2} />
            <Text style={styles.location}>China Town</Text>
          </View>

          <Pressable
            style={styles.cartButton}
            onPress={() => {
              // TODO: open the Cart screen once it exists.
            }}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${itemCount} items`}
          >
            <ShoppingCart size={20} color={colors.textPrimary} strokeWidth={1.75} />
            {itemCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Fresh dishes, made to order</Text>

        <AppTextInput
          placeholder="Search dishes..."
          value={search}
          onChangeText={setSearch}
          leftIcon={<Search size={20} color={colors.textMuted} strokeWidth={1.75} />}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <CategoryChips
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{isFiltered ? 'Results' : 'Popular now'}</Text>
          <Text style={styles.count}>
            {total} {total === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            onPress={() => {
              // TODO: open Dish Details once it exists.
            }}
            onAdd={addItem}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} color={colors.primary} />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  location: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  title: {
    marginTop: 16,
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 16,
    fontSize: 14,
    color: colors.textMuted,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 10,
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  count: { fontSize: 12, color: colors.textMuted },
  listContent: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  separator: { height: 12 },
  footer: { marginVertical: 16 },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  stateText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  retry: { marginTop: 20, alignSelf: 'stretch' },
});
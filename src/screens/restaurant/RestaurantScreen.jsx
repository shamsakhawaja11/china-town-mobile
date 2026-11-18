import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageSquare,
  Navigation,
  Share2,
} from 'lucide-react-native';
import AppButton from '../../components/common/AppButton';
import DishCard from '../../components/restaurant/DishCard';
import InfoChip from '../../components/restaurant/InfoChip';
import {
  getMenuItems,
  getRestaurant,
  getTablesSummary,
} from '../../api/restaurantApi';
import { colors } from '../../theme';

const OPEN_GREEN = '#2E9E5B';
const PADDING = 20;
const GRID_GAP = 12;
const PKT_OFFSET_MINUTES = 5 * 60; // Pakistan is UTC+5 all year, no daylight saving

// "23:30" -> minutes since midnight
const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + m;
};

// "23:30" -> "11:30 PM"
const formatTime = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
};

// Judged in Pakistan time, not the phone's time zone.
const getOpenStatus = (opening, closing) => {
  const now = new Date();
  const nowMinutes =
    (now.getUTCHours() * 60 + now.getUTCMinutes() + PKT_OFFSET_MINUTES) % 1440;
  const isOpen = nowMinutes >= toMinutes(opening) && nowMinutes < toMinutes(closing);
  return isOpen
    ? { title: 'Open now', subtitle: `Until ${formatTime(closing)}`, color: OPEN_GREEN }
    : { title: 'Closed', subtitle: `Opens ${formatTime(opening)}`, color: colors.error };
};

const RestaurantScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [tables, setTables] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const cellWidth = (width - PADDING * 2 - GRID_GAP * 2) / 3;

  const load = useCallback(async () => {
    setError('');
    // allSettled: a menu or tables failure should not blank the whole screen.
    const [restaurantResult, menuResult, tablesResult] = await Promise.allSettled([
      getRestaurant(),
      getMenuItems({ limit: 6 }),
      getTablesSummary(),
    ]);

    if (restaurantResult.status === 'fulfilled') {
      setRestaurant(restaurantResult.value);
    } else {
      setError(restaurantResult.reason?.message || 'Could not load the restaurant');
    }

    if (menuResult.status === 'fulfilled') {
      setDishes(menuResult.value.items ?? []);
    }

    if (tablesResult.status === 'fulfilled') {
      setTables(tablesResult.value);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await load();
      setLoading(false);
    };
    run();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleBack = () => {
    if (navigation?.canGoBack()) navigation.goBack();
  };

  const handleShare = () => {
    if (!restaurant) return;
    Share.share({ message: `${restaurant.name}\n${restaurant.address}` });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
        <AppButton
          title="Try again"
          onPress={async () => {
            setLoading(true);
            await load();
            setLoading(false);
          }}
          style={styles.retry}
        />
      </View>
    );
  }

  const status = getOpenStatus(restaurant.opening_time, restaurant.closing_time);

  const totalTables = tables?.total_tables ?? 0;
  const tablesTitle = `${totalTables} ${totalTables === 1 ? 'table' : 'tables'}`;
  const tablesSubtitle = tables?.categories?.length
    ? tables.categories.join(', ')
    : undefined;

  return (
    <View style={styles.flex}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero */}
        <View style={styles.hero}>
          {restaurant.image_url ? (
            <Image
              source={{ uri: restaurant.image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]} />
          )}

          <View style={[styles.heroActions, { top: insets.top + 8 }]}>
            <Pressable
              style={styles.roundButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color={colors.textPrimary} strokeWidth={2} />
            </Pressable>
            <Pressable
              style={styles.roundButton}
              onPress={handleShare}
              accessibilityRole="button"
              accessibilityLabel="Share restaurant"
            >
              <Share2 size={20} color={colors.textPrimary} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Content card overlapping the hero */}
        <View style={styles.card}>
          <View style={styles.nameRow}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.name} numberOfLines={1}>
              {restaurant.name}
            </Text>
          </View>

          <View style={styles.addressRow}>
            <View style={styles.addressLeft}>
              <MapPin size={16} color={colors.textMuted} strokeWidth={1.75} />
              <Text style={styles.address} numberOfLines={1}>
                {restaurant.address}
              </Text>
            </View>
            <Pressable
              style={styles.mapLink}
              hitSlop={8}
              onPress={() => navigation?.navigate('Map')}
              accessibilityRole="button"
              accessibilityLabel="View map"
            >
              <Navigation size={14} color={colors.primary} strokeWidth={2} />
              <Text style={styles.mapLinkText}>View map</Text>
            </Pressable>
          </View>

          <View style={styles.chipRow}>
            <InfoChip
              title={status.title}
              subtitle={status.subtitle}
              titleColor={status.color}
            />
            {totalTables > 0 ? (
              <InfoChip title={tablesTitle} subtitle={tablesSubtitle} />
            ) : null}
          </View>

          {restaurant.description ? (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.about}>{restaurant.description}</Text>
            </>
          ) : null}

          {dishes.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Popular dishes</Text>
              <View style={styles.grid}>
                {dishes.map((dish) => (
                  <View key={dish.id} style={{ width: cellWidth }}>
                    <DishCard item={dish} />
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Fixed action bar */}
      <View style={styles.actionBar}>
        <Pressable
          style={({ pressed }) => [styles.bookButton, pressed && styles.pressed]}
          onPress={() => navigation?.navigate('BookTable')}
          accessibilityRole="button"
          accessibilityLabel="Book a table"
        >
          <Text style={styles.bookText}>Book a table</Text>
          <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.25} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.reviewsButton, pressed && styles.pressed]}
          onPress={() => {
            // TODO: navigate to the reviews screen once it exists.
          }}
          accessibilityRole="button"
          accessibilityLabel="See reviews"
        >
          <MessageSquare size={16} color={colors.primary} strokeWidth={2} />
          <Text style={styles.reviewsText}>See reviews</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  errorText: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  retry: { marginTop: 20, alignSelf: 'stretch' },
  scrollContent: { paddingBottom: 120 },

  hero: { height: 260 },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { backgroundColor: colors.border },
  heroActions: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
  },

  card: {
    marginTop: -28,
    paddingHorizontal: PADDING,
    paddingTop: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 52, height: 52, borderRadius: 12 },
  name: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.textPrimary },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  addressLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  address: { flex: 1, fontSize: 13, color: colors.textMuted },
  mapLink: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 12 },
  mapLinkText: { fontSize: 13, fontWeight: '600', color: colors.primary },

  chipRow: { flexDirection: 'row', gap: 12, marginTop: 16 },

  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  about: { fontSize: 14, lineHeight: 21, color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP, rowGap: 16 },

  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: PADDING,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  bookButton: {
    flex: 1.4,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
  },
  bookText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  reviewsButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
  },
  reviewsText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  pressed: { opacity: 0.85 },
});
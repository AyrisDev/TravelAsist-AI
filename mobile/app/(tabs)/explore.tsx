import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { MOCK_PLAN, GeneratedPlan } from '@/types/plan';

export default function PlansScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [plans, setPlans] = useState<GeneratedPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // For now, use mock data
  // TODO: Replace with actual API call
  const loadPlans = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPlans([MOCK_PLAN]);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlans();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderPlanCard = ({ item }: { item: GeneratedPlan }) => {
    const budgetStatus = item.budgetDifference >= 0 ? 'under' : 'over';
    const budgetColor = budgetStatus === 'under' ? '#34C759' : '#FF3B30';

    return (
      <TouchableOpacity
        style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/(plan)/${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={styles.planHeader}>
          <View style={styles.planRoute}>
            <Text style={[styles.cityText, { color: colors.text }]}>
              {item.origin}
            </Text>
            <Text style={[styles.arrowText, { color: colors.tabIconDefault }]}>→</Text>
            <Text style={[styles.cityText, { color: colors.text }]}>
              {item.destination}
            </Text>
          </View>
          <View style={[styles.statusBadge, {
            backgroundColor: item.status === 'completed' ? '#34C759' : '#FF9500'
          }]}>
            <Text style={styles.statusText}>
              {item.status === 'completed' ? '✓ Hazır' : '⏳ Hazırlanıyor'}
            </Text>
          </View>
        </View>

        {/* Dates */}
        <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
          📅 {formatDate(item.startDate)} - {formatDate(item.endDate)} ({item.totalDays} gün)
        </Text>

        {/* Cities */}
        <View style={styles.citiesContainer}>
          {item.dailyItinerary.slice(0, 3).map((day, index) => (
            <View
              key={index}
              style={[styles.cityBadge, { backgroundColor: `${colors.tint}20` }]}
            >
              <Text style={[styles.cityBadgeText, { color: colors.tint }]}>
                {day.city}
              </Text>
            </View>
          ))}
          {item.dailyItinerary.length > 3 && (
            <Text style={[styles.moreText, { color: colors.tabIconDefault }]}>
              +{item.dailyItinerary.length - 3} more
            </Text>
          )}
        </View>

        {/* Budget */}
        <View style={styles.budgetContainer}>
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, { color: colors.tabIconDefault }]}>
              Tahmini Maliyet:
            </Text>
            <Text style={[styles.budgetAmount, { color: colors.text }]}>
              ${item.totalEstimatedCost}
            </Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, { color: colors.tabIconDefault }]}>
              Bütçeniz:
            </Text>
            <Text style={[styles.budgetAmount, { color: colors.text }]}>
              ${item.userBudget}
            </Text>
          </View>
          <View style={[styles.budgetDifference, { backgroundColor: `${budgetColor}20` }]}>
            <Text style={[styles.budgetDifferenceText, { color: budgetColor }]}>
              {budgetStatus === 'under' ? '💰' : '⚠️'} Bütçenizin{' '}
              {Math.abs(item.budgetDifference)}${' '}
              {budgetStatus === 'under' ? 'altında' : 'üstünde'}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
            Detayları görmek için tıklayın
          </Text>
          <Text style={[styles.arrowIcon, { color: colors.tint }]}>→</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyIcon, { color: colors.tabIconDefault }]}>✈️</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Henüz Plan Yok
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.tabIconDefault }]}>
        Ana sayfadan "Yeni Plan Oluştur" butonuna tıklayarak ilk seyahat planınızı oluşturun!
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.createButtonText}>Ana Sayfaya Git</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.tabIconDefault }]}>
          Planlarınız yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Seyahat Planlarım
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.tabIconDefault }]}>
          {plans.length} plan
        </Text>
      </View>

      <FlatList
        data={plans}
        renderItem={renderPlanCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          plans.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  planCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowText: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    marginBottom: 12,
  },
  citiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 12,
    paddingVertical: 6,
  },
  budgetContainer: {
    gap: 8,
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    fontSize: 14,
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetDifference: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  budgetDifferenceText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerText: {
    fontSize: 13,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { MOCK_PLAN } from '@/types/plan';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // For now, use mock data
  // TODO: Fetch actual plan by ID
  const plan = MOCK_PLAN;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'short',
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Budget Summary */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>💰 Bütçe Özeti</Text>
        <View style={styles.budgetGrid}>
          <View style={styles.budgetItem}>
            <Text style={[styles.budgetLabel, { color: colors.tabIconDefault }]}>
              Toplam Maliyet
            </Text>
            <Text style={[styles.budgetValue, { color: colors.text }]}>
              ${plan.totalEstimatedCost}
            </Text>
          </View>
          <View style={styles.budgetItem}>
            <Text style={[styles.budgetLabel, { color: colors.tabIconDefault }]}>Bütçeniz</Text>
            <Text style={[styles.budgetValue, { color: colors.text }]}>${plan.userBudget}</Text>
          </View>
        </View>

        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.tabIconDefault }]}>✈️ Uçuşlar</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>${plan.breakdown.flights}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.tabIconDefault }]}>🏨 Konaklama</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>${plan.breakdown.accommodation}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.tabIconDefault }]}>🚌 Ulaşım</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>${plan.breakdown.transportation}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={[styles.breakdownLabel, { color: colors.tabIconDefault }]}>🎯 Aktiviteler</Text>
            <Text style={[styles.breakdownValue, { color: colors.text }]}>${plan.breakdown.activities}</Text>
          </View>
        </View>
      </View>

      {/* International Flights */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>✈️ Uluslararası Uçuşlar</Text>

        {/* Outbound */}
        <View style={[styles.flightCard, { backgroundColor: `${colors.tint}10` }]}>
          <Text style={[styles.flightTitle, { color: colors.tint }]}>Gidiş</Text>
          <View style={styles.flightRoute}>
            <View style={styles.flightCity}>
              <Text style={[styles.cityCode, { color: colors.text }]}>
                {plan.internationalFlight.outbound.departure.airport}
              </Text>
              <Text style={[styles.flightTime, { color: colors.text }]}>
                {plan.internationalFlight.outbound.departure.time}
              </Text>
              <Text style={[styles.flightDate, { color: colors.tabIconDefault }]}>
                {formatDate(plan.internationalFlight.outbound.departure.date)}
              </Text>
            </View>
            <View style={styles.flightDuration}>
              <Text style={[styles.durationText, { color: colors.tabIconDefault }]}>
                {plan.internationalFlight.outbound.duration}
              </Text>
              <Text style={{ color: colors.tabIconDefault }}>→</Text>
            </View>
            <View style={styles.flightCity}>
              <Text style={[styles.cityCode, { color: colors.text }]}>
                {plan.internationalFlight.outbound.arrival.airport}
              </Text>
              <Text style={[styles.flightTime, { color: colors.text }]}>
                {plan.internationalFlight.outbound.arrival.time}
              </Text>
              <Text style={[styles.flightDate, { color: colors.tabIconDefault }]}>
                {formatDate(plan.internationalFlight.outbound.arrival.date)}
              </Text>
            </View>
          </View>
          <Text style={[styles.flightDetails, { color: colors.tabIconDefault }]}>
            {plan.internationalFlight.outbound.airline} • {plan.internationalFlight.outbound.flightNumber}
          </Text>
          <Text style={[styles.flightPrice, { color: colors.tint }]}>
            ${plan.internationalFlight.outbound.price}
          </Text>
        </View>

        {/* Return */}
        <View style={[styles.flightCard, { backgroundColor: `${colors.tint}10` }]}>
          <Text style={[styles.flightTitle, { color: colors.tint }]}>Dönüş</Text>
          <View style={styles.flightRoute}>
            <View style={styles.flightCity}>
              <Text style={[styles.cityCode, { color: colors.text }]}>
                {plan.internationalFlight.return.departure.airport}
              </Text>
              <Text style={[styles.flightTime, { color: colors.text }]}>
                {plan.internationalFlight.return.departure.time}
              </Text>
            </View>
            <View style={styles.flightDuration}>
              <Text style={[styles.durationText, { color: colors.tabIconDefault }]}>
                {plan.internationalFlight.return.duration}
              </Text>
              <Text style={{ color: colors.tabIconDefault }}>→</Text>
            </View>
            <View style={styles.flightCity}>
              <Text style={[styles.cityCode, { color: colors.text }]}>
                {plan.internationalFlight.return.arrival.airport}
              </Text>
              <Text style={[styles.flightTime, { color: colors.text }]}>
                {plan.internationalFlight.return.arrival.time}
              </Text>
            </View>
          </View>
          <Text style={[styles.flightDetails, { color: colors.tabIconDefault }]}>
            {plan.internationalFlight.return.airline} • {plan.internationalFlight.return.flightNumber}
          </Text>
          <Text style={[styles.flightPrice, { color: colors.tint }]}>
            ${plan.internationalFlight.return.price}
          </Text>
        </View>
      </View>

      {/* Daily Itinerary */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📅 Günlük Plan</Text>
        {plan.dailyItinerary.map((day, index) => (
          <View key={day.day} style={styles.dayCard}>
            <View style={[styles.dayHeader, { backgroundColor: `${colors.tint}20` }]}>
              <Text style={[styles.dayTitle, { color: colors.tint }]}>
                Gün {day.day} - {day.city}
              </Text>
              <Text style={[styles.dayDate, { color: colors.text }]}>
                {formatDate(day.date)}
              </Text>
            </View>

            {/* Accommodation */}
            <View style={styles.accommodation}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🏨 Konaklama</Text>
              <Text style={[styles.hotelName, { color: colors.text }]}>
                {day.accommodation.name}
              </Text>
              <Text style={[styles.hotelDetails, { color: colors.tabIconDefault }]}>
                ⭐ {day.accommodation.rating} • {day.accommodation.type} • ${day.accommodation.pricePerNight}/gece
              </Text>
            </View>

            {/* Activities */}
            <View style={styles.activities}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 Aktiviteler</Text>
              {day.activities.map((activity, idx) => (
                <View key={idx} style={styles.activity}>
                  {activity.time && (
                    <Text style={[styles.activityTime, { color: colors.tint }]}>
                      {activity.time}
                    </Text>
                  )}
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.activityDesc, { color: colors.tabIconDefault }]}>
                    {activity.description}
                  </Text>
                  {activity.estimatedCost && (
                    <Text style={[styles.activityCost, { color: colors.tint }]}>
                      ~${activity.estimatedCost}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Transportation to next city */}
            {day.transportation && (
              <View style={[styles.transport, { backgroundColor: `${colors.tint}10` }]}>
                <Text style={[styles.transportTitle, { color: colors.tint }]}>
                  🚌 {day.city} → {plan.dailyItinerary[index + 1]?.city}
                </Text>
                <Text style={[styles.transportDetails, { color: colors.text }]}>
                  {day.transportation.type.toUpperCase()} • {day.transportation.departure} - {day.transportation.arrival}
                </Text>
                <Text style={[styles.transportCost, { color: colors.tabIconDefault }]}>
                  ${day.transportation.price}
                </Text>
              </View>
            )}

            <View style={styles.dayFooter}>
              <Text style={[styles.dayCost, { color: colors.tint }]}>
                Gün Toplam: ${day.totalCost}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  budgetGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  budgetItem: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  breakdown: {
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  flightCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  flightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flightCity: {
    alignItems: 'center',
  },
  cityCode: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flightTime: {
    fontSize: 14,
    marginTop: 4,
  },
  flightDate: {
    fontSize: 11,
    marginTop: 2,
  },
  flightDuration: {
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 11,
  },
  flightDetails: {
    fontSize: 13,
    marginBottom: 4,
  },
  flightPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayCard: {
    marginBottom: 16,
  },
  dayHeader: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayDate: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  accommodation: {
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  hotelDetails: {
    fontSize: 13,
  },
  activities: {
    marginBottom: 12,
  },
  activity: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDesc: {
    fontSize: 13,
  },
  activityCost: {
    fontSize: 12,
    marginTop: 4,
  },
  transport: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  transportTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  transportDetails: {
    fontSize: 13,
    marginBottom: 2,
  },
  transportCost: {
    fontSize: 13,
  },
  dayFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    marginTop: 8,
  },
  dayCost: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

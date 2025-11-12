import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTrip } from '@/contexts/trip-context';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import {
  ACCOMMODATION_TYPES,
  TRAVEL_STYLES,
  AccommodationType,
  TravelStyle,
  TripRequest,
} from '@/types/trip';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

export default function Step3Screen() {
  const { formData, updateFormData, resetFormData } = useTrip();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationType>(
    formData.accommodationType || 'any'
  );
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<TravelStyle>(
    formData.travelStyle || 'slow'
  );
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Hata', 'Lütfen giriş yapın');
      return;
    }

    // Update form data
    updateFormData({
      accommodationType: selectedAccommodation,
      travelStyle: selectedTravelStyle,
    });

    // Validate all data
    if (!formData.origin || !formData.destination || !formData.startDate || !formData.endDate || !formData.budget || !formData.cities || formData.cities.length === 0) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);

    try {
      // Get session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
      }

      // Set token for API client
      api.setToken(session.access_token);

      // Format dates to ISO strings
      const startDateStr = formData.startDate.toISOString().split('T')[0];
      const endDateStr = formData.endDate.toISOString().split('T')[0];

      // Create trip request object
      const tripRequest: Omit<TripRequest, 'user_id'> = {
        origin: formData.origin,
        destination: formData.destination,
        start_date: startDateStr,
        end_date: endDateStr,
        budget: formData.budget,
        requested_cities: formData.cities,
        accommodation_preference: selectedAccommodation,
        travel_style: selectedTravelStyle,
      };

      // Send to backend API
      const response = await api.createTrip(tripRequest);

      if (!response.success) {
        throw new Error(response.error || 'Plan oluşturulurken bir hata oluştu');
      }

      // Success!
      Alert.alert(
        'Başarılı! 🎉',
        'Seyahat planınız oluşturuldu! Yapay zeka şu anda sizin için en iyi rotayı hesaplıyor. Kısa süre içinde planınız hazır olacak.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              resetFormData();
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Trip creation error:', error);
      Alert.alert('Hata', error.message || 'Plan oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Tercihleriniz
        </Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Son adım! Konaklama ve seyahat tarzınızı belirleyin
        </Text>

        {/* Accommodation Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🏨 Konaklama Tercihi
          </Text>
          <View style={styles.optionsGrid}>
            {ACCOMMODATION_TYPES.map((type) => {
              const isSelected = selectedAccommodation === type.value;
              return (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isSelected ? '#007AFF' : colors.card,
                      borderColor: isSelected ? '#007AFF' : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedAccommodation(type.value)}
                >
                  <Text style={styles.optionIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? '#fff' : colors.text },
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Travel Style */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ✈️ Seyahat Tarzı
          </Text>
          {TRAVEL_STYLES.map((style) => {
            const isSelected = selectedTravelStyle === style.value;
            return (
              <TouchableOpacity
                key={style.value}
                style={[
                  styles.travelStyleCard,
                  {
                    backgroundColor: isSelected ? '#007AFF' : colors.card,
                    borderColor: isSelected ? '#007AFF' : colors.border,
                  },
                ]}
                onPress={() => setSelectedTravelStyle(style.value)}
              >
                <View style={styles.travelStyleHeader}>
                  <Text style={styles.travelStyleIcon}>{style.icon}</Text>
                  <Text
                    style={[
                      styles.travelStyleLabel,
                      { color: isSelected ? '#fff' : colors.text },
                    ]}
                  >
                    {style.label}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.travelStyleDescription,
                    { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.tabIconDefault },
                  ]}
                >
                  {style.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary */}
        <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            📋 Plan Özeti
          </Text>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
              Güzergah:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.origin} → {formData.destination}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
              Tarih:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.startDate?.toLocaleDateString('tr-TR')} -{' '}
              {formData.endDate?.toLocaleDateString('tr-TR')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
              Bütçe:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${formData.budget}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.tabIconDefault }]}>
              Şehirler:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {formData.cities?.join(', ')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handleBack}
          disabled={loading}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            ← Geri
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>🎉 Planı Oluştur</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  travelStyleCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  travelStyleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  travelStyleIcon: {
    fontSize: 28,
  },
  travelStyleLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  travelStyleDescription: {
    fontSize: 14,
    marginLeft: 40,
  },
  summary: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    width: 80,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

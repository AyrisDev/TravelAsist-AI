import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTrip } from '@/contexts/trip-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { THAILAND_CITIES, City } from '@/types/trip';

export default function Step2Screen() {
  const { formData, updateFormData, setCurrentStep } = useTrip();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedCities, setSelectedCities] = useState<string[]>(
    formData.cities || []
  );

  const toggleCity = (cityId: string) => {
    if (selectedCities.includes(cityId)) {
      setSelectedCities(selectedCities.filter((id) => id !== cityId));
    } else {
      setSelectedCities([...selectedCities, cityId]);
    }
  };

  const handleNext = () => {
    if (selectedCities.length === 0) {
      Alert.alert('Hata', 'Lütfen en az bir şehir seçin');
      return;
    }

    if (selectedCities.length > 5) {
      Alert.alert('Hata', 'Maksimum 5 şehir seçebilirsiniz');
      return;
    }

    // Save selected city names
    const cityNames = THAILAND_CITIES
      .filter((city) => selectedCities.includes(city.id))
      .map((city) => city.name);

    updateFormData({ cities: cityNames });
    setCurrentStep(3);
    router.push('/(trip)/step3');
  };

  const handleBack = () => {
    setCurrentStep(1);
    router.back();
  };

  const popularCities = THAILAND_CITIES.filter((city) => city.popular);
  const otherCities = THAILAND_CITIES.filter((city) => !city.popular);

  const renderCity = (city: City) => {
    const isSelected = selectedCities.includes(city.id);

    return (
      <TouchableOpacity
        key={city.id}
        style={[
          styles.cityCard,
          {
            backgroundColor: isSelected ? '#007AFF' : colors.card,
            borderColor: isSelected ? '#007AFF' : colors.border,
          },
        ]}
        onPress={() => toggleCity(city.id)}
      >
        <Text
          style={[
            styles.cityName,
            { color: isSelected ? '#fff' : colors.text },
          ]}
        >
          {isSelected ? '✓ ' : ''}
          {city.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Hangi Şehirleri Gezmek İstersiniz?
        </Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          1-5 arası şehir seçin (Seçili: {selectedCities.length})
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🌟 Popüler Şehirler
          </Text>
          <View style={styles.cityGrid}>
            {popularCities.map(renderCity)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            📍 Diğer Şehirler
          </Text>
          <View style={styles.cityGrid}>
            {otherCities.map(renderCity)}
          </View>
        </View>

        <View style={styles.hint}>
          <Text style={[styles.hintText, { color: colors.tabIconDefault }]}>
            💡 İpucu: Yapay zeka, seçtiğiniz şehirler arasında en optimal rotayı
            oluşturacak ve bütçenize göre en uygun konaklama seçeneklerini sunacak.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.border }]}
          onPress={handleBack}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            ← Geri
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedCities.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedCities.length === 0}
        >
          <Text style={styles.nextButtonText}>Sonraki →</Text>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cityCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 8,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
  },
  hint: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
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
  nextButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

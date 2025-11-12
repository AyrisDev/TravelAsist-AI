import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTrip } from '@/contexts/trip-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function Step1Screen() {
  const { formData, updateFormData, setCurrentStep } = useTrip();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [origin, setOrigin] = useState(formData.origin || 'Turkey');
  const [destination, setDestination] = useState(formData.destination || 'Thailand');
  const [budget, setBudget] = useState(formData.budget?.toString() || '');

  const [startDate, setStartDate] = useState(formData.startDate || new Date());
  const [endDate, setEndDate] = useState(
    formData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleNext = () => {
    // Validation
    if (!origin.trim()) {
      Alert.alert('Hata', 'Lütfen nereden gittiğinizi belirtin');
      return;
    }
    if (!destination.trim()) {
      Alert.alert('Hata', 'Lütfen nereye gideceğinizi belirtin');
      return;
    }
    if (!budget || parseInt(budget) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir bütçe girin');
      return;
    }
    if (startDate >= endDate) {
      Alert.alert('Hata', 'Dönüş tarihi, gidiş tarihinden sonra olmalıdır');
      return;
    }

    // Calculate days difference
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 1) {
      Alert.alert('Hata', 'En az 1 günlük seyahat planlamalısınız');
      return;
    }
    if (daysDiff > 30) {
      Alert.alert('Hata', 'Maksimum 30 günlük seyahat planlayabilirsiniz');
      return;
    }

    // Save data and navigate
    updateFormData({
      origin: origin.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      budget: parseInt(budget),
    });
    setCurrentStep(2);
    router.push('/(trip)/step2');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Seyahat Detaylarınız
      </Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Temel bilgileri girerek başlayalım
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Nereden? *</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Örn: Turkey"
          placeholderTextColor={colors.tabIconDefault}
          value={origin}
          onChangeText={setOrigin}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Nereye? *</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Örn: Thailand"
          placeholderTextColor={colors.tabIconDefault}
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Gidiş Tarihi *</Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            📅 {formatDate(startDate)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Dönüş Tarihi *</Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={[styles.dateText, { color: colors.text }]}>
            📅 {formatDate(endDate)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          Toplam Bütçe (USD) *
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Örn: 1500"
          placeholderTextColor={colors.tabIconDefault}
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
        <Text style={[styles.hint, { color: colors.tabIconDefault }]}>
          Uçuş, konaklama ve ulaşım dahil toplam bütçeniz
        </Text>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Sonraki Adım →</Text>
      </TouchableOpacity>

      {/* Start Date Picker */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showStartDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Text style={[styles.modalButton, { color: colors.text }]}>İptal</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Gidiş Tarihi</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                  <Text style={[styles.modalButton, styles.modalButtonDone]}>Tamam</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setStartDate(selectedDate);
                    if (selectedDate >= endDate) {
                      setEndDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                    }
                  }
                }}
                textColor={colors.text}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
                if (selectedDate >= endDate) {
                  setEndDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
                }
              }
            }}
          />
        )
      )}

      {/* End Date Picker */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showEndDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Text style={[styles.modalButton, { color: colors.text }]}>İptal</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Dönüş Tarihi</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                  <Text style={[styles.modalButton, styles.modalButtonDone]}>Tamam</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={endDate}
                mode="date"
                display="spinner"
                minimumDate={startDate}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                }}
                textColor={colors.text}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            minimumDate={startDate}
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButton: {
    fontSize: 16,
  },
  modalButtonDone: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

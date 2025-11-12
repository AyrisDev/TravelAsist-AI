import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="step1"
        options={{
          title: 'Plan Bilgileri (1/3)',
          headerBackTitle: 'Geri'
        }}
      />
      <Stack.Screen
        name="step2"
        options={{
          title: 'Şehir Seçimi (2/3)',
          headerBackTitle: 'Geri'
        }}
      />
      <Stack.Screen
        name="step3"
        options={{
          title: 'Tercihler (3/3)',
          headerBackTitle: 'Geri'
        }}
      />
    </Stack>
  );
}

import React, { createContext, useContext, useState } from 'react';
import { TripFormData, AccommodationType, TravelStyle } from '@/types/trip';

interface TripContextType {
  formData: Partial<TripFormData>;
  updateFormData: (data: Partial<TripFormData>) => void;
  resetFormData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const initialFormData: Partial<TripFormData> = {
  origin: 'Turkey',
  destination: 'Thailand',
  cities: [],
  accommodationType: 'any',
  travelStyle: 'slow',
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<Partial<TripFormData>>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<TripFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return (
    <TripContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

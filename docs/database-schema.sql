-- Gezgin Asistan Database Schema
-- PRD.md'deki şemaya göre oluşturuldu

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles tablosu (Supabase Auth users tablosuna bağlı)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip Requests tablosu (Kullanıcının plan talebi)
CREATE TABLE trip_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget INTEGER NOT NULL,
  requested_cities TEXT[] NOT NULL,
  accommodation_preference TEXT CHECK (accommodation_preference IN ('hostel', 'hotel', 'apartment', 'any')),
  travel_style TEXT CHECK (travel_style IN ('fast', 'slow', 'adventure')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Plans tablosu (AI'ın ürettiği plan)
CREATE TABLE generated_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES trip_requests(id) ON DELETE CASCADE,
  total_estimated_cost INTEGER NOT NULL,
  plan_data JSONB NOT NULL, -- Gün-gün plan detayları
  international_flight_details JSONB, -- Uluslararası uçuş bilgileri
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_plans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trip Requests Policies
CREATE POLICY "Users can view their own trip requests"
  ON trip_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trip requests"
  ON trip_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trip requests"
  ON trip_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Generated Plans Policies
CREATE POLICY "Users can view plans for their trip requests"
  ON generated_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_requests
      WHERE trip_requests.id = generated_plans.request_id
      AND trip_requests.user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_trip_requests_user_id ON trip_requests(user_id);
CREATE INDEX idx_trip_requests_status ON trip_requests(status);
CREATE INDEX idx_generated_plans_request_id ON generated_plans(request_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_requests_updated_at BEFORE UPDATE ON trip_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_plans_updated_at BEFORE UPDATE ON generated_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

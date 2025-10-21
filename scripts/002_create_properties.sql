-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'canine_residence')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 1,
  max_pets INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for geolocation queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties (type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties (price_per_night);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Properties policies (public read, admin write)
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

-- Insert sample data
INSERT INTO properties (name, description, type, address, city, country, latitude, longitude, price_per_night, max_guests, max_pets, amenities, images, rating, total_reviews) VALUES
  ('Luxury Pet Hotel Downtown', 'Premium accommodation for you and your furry friends in the heart of the city', 'hotel', '123 Main St', 'New York', 'USA', 40.7128, -74.0060, 150.00, 2, 2, ARRAY['wifi', 'parking', 'pet_spa', 'restaurant', 'pool'], ARRAY['/placeholder.svg?height=400&width=600'], 4.8, 124),
  ('Cozy Canine Residence', 'Specialized care facility for dogs with spacious play areas', 'canine_residence', '456 Park Ave', 'New York', 'USA', 40.7589, -73.9851, 80.00, 0, 3, ARRAY['outdoor_space', 'grooming', 'training', 'vet_on_call'], ARRAY['/placeholder.svg?height=400&width=600'], 4.9, 89),
  ('Beachside Pet Resort', 'Oceanfront property with pet-friendly amenities and beach access', 'hotel', '789 Ocean Blvd', 'Miami', 'USA', 25.7617, -80.1918, 200.00, 4, 2, ARRAY['wifi', 'beach_access', 'pet_spa', 'restaurant', 'pool'], ARRAY['/placeholder.svg?height=400&width=600'], 4.7, 156),
  ('Mountain View Canine Lodge', 'Peaceful mountain retreat for dogs with hiking trails', 'canine_residence', '321 Mountain Rd', 'Denver', 'USA', 39.7392, -104.9903, 95.00, 0, 4, ARRAY['outdoor_space', 'hiking_trails', 'grooming', 'vet_on_call'], ARRAY['/placeholder.svg?height=400&width=600'], 4.6, 67),
  ('Urban Pet Suites', 'Modern pet hotel with luxury suites and 24/7 care', 'hotel', '555 City Center', 'Los Angeles', 'USA', 34.0522, -118.2437, 175.00, 2, 2, ARRAY['wifi', 'parking', 'pet_spa', 'restaurant', '24_7_care'], ARRAY['/placeholder.svg?height=400&width=600'], 4.9, 203),
  ('Happy Tails Residence', 'Family-run canine residence with personalized care', 'canine_residence', '888 Suburban Ln', 'Chicago', 'USA', 41.8781, -87.6298, 70.00, 0, 3, ARRAY['outdoor_space', 'grooming', 'training', 'webcam_access'], ARRAY['/placeholder.svg?height=400&width=600'], 4.8, 92);

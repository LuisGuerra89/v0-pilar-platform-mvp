export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  user_id: string
  name: string
  species: "dog" | "cat" | "other"
  breed: string | null
  age: number | null
  weight: number | null
  special_needs: string | null
  created_at: string
  updated_at: string
}

export interface Property {
  id: string
  name: string
  description: string | null
  type: "hotel" | "canine_residence"
  address: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  price_per_night: number
  max_guests: number
  max_pets: number
  amenities: string[]
  images: string[]
  rating: number
  total_reviews: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  property_id: string
  check_in: string
  check_out: string
  guests: number
  pets: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  payment_intent_id: string | null
  special_requests: string | null
  created_at: string
  updated_at: string
  properties?: Property
}

export interface SearchFilters {
  query?: string
  type?: "hotel" | "canine_residence" | "all"
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  city?: string
}

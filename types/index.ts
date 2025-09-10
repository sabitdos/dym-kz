export interface Hookah {
  $id: string
  name: string
  brand: string
  price: number
  img_url: string[]
  size: "small" | "medium" | "large"
  description: string
  available: boolean
  rating: number
  reviews_count: number
  popularity?: number
}

export interface Tobacco {
  $id: string
  name: string
  flavor: string[]
  strength: number
  price: number
  brand: string
  description: string
  img_url: string
  available: boolean
}

export interface CartItem {
  id: string
  hookah: {
    id: number
    name: string
    brand: string
    price: number
    image: string
    size: string
  }
  tobaccos: {
    id: number
    name: string
    brand: string
    price: number
    weight: number
  }[]
  rentalHours: number
  quantity: number
  addedAt: string
}

export interface SelectedTobacco {
  tobacco: Tobacco
  weight: number
}

export interface Order {
  $id: string
  orderNumber: string
  user_id: string
  items: CartItem[]
  delivery_address: DeliveryAddress
  delivery_time: string
  status: "new" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled"
  total_price: number
  payment_method: "cash" | "card" | "kaspi"
  payment_status: "pending" | "paid" | "failed"
  created_at: string
  updated_at: string
  customer: {
    firstName: string
    lastName: string
    phone: string
    email?: string
  }
}

export interface DeliveryAddress {
  street: string
  building: string
  apartment?: string
  entrance?: string
  floor?: string
  coordinates?: {
    lat: number
    lng: number
  }
  notes?: string
}

export interface User {
  $id: string
  name: string
  email: string
  phone: string
  addresses: DeliveryAddress[]
  loyalty_points: number
  orders_count: number
}

export interface Master {
  $id: string
  name: string
  avatar?: string
  bio?: string
  experience_years?: number
  rating: number
  total_reviews: number
  specialties: string[]
  certificate_file_ids?: string[]
  availability?: Record<string, string[]>
}

export interface MasterReview {
  $id: string
  master_id: string
  user_id?: string
  rating: number
  comment: string
  created_at: string
  user_name?: string
}

export interface MasterBooking {
  $id: string
  master_id: string
  user_id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  created_at: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes?: string
}

import type { Models } from 'appwrite'

// Base user profile document (extension of Appwrite account + custom fields)
export interface UserProfile extends Models.Document {
  name?: string
  email?: string
  phone?: string
  avatar?: string
  role?: 'admin' | 'manager' | 'user'
  city?: string
  isAdmin?: boolean
}

export interface Hookah extends Models.Document {
  title: string
  brand?: string
  price?: number
  category?: string
  available?: boolean
}

export interface Order extends Models.Document {
  userId: string
  items: Array<{ hookahId: string; qty: number; price: number }>
  total: number
  status: 'new' | 'processing' | 'delivering' | 'done' | 'canceled'
  city?: string
}

export interface NotificationDoc extends Models.Document {
  userId?: string
  type: 'system' | 'order' | 'promo'
  title: string
  message: string
  read?: boolean
}

export interface CollectionsIds {
  USERS: string
  HOOKAHS: string
  TOBACCOS?: string
  COALS?: string
  ORDERS: string
  NOTIFICATIONS?: string
  MASTERS?: string
  MASTER_REVIEWS?: string
  BOOKINGS?: string
  [k: string]: any
}

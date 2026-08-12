// ============================================================
// TypeScript interfaces for all data models
// ============================================================

export interface Service {
  _id?: string;
  serviceId: string;
  name: string;
  icon: string;
  price: string;
  duration: string;
  image: string;
  description: string;
  features: string[];
  popular?: boolean;
  category: 'main' | 'additional';
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  _id?: string;
  name: string;
  location: string;
  rating: number;
  service: string;
  image: string;
  text: string;
  date: string;
  source: 'manual' | 'feedback' | 'google';
  isApproved: boolean;
  createdAt?: string;
}

export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SiteConfigSection {
  _id?: string;
  section: string;
  data: Record<string, any>;
  updatedAt?: string;
}

export interface HeroConfig {
  title: string;
  titleAccent: string;
  subtitle: string;
  backgroundImage: string;
  features: { icon: string; text: string }[];
}

export interface HeaderConfig {
  brandName: string;
  tagline: string;
  phone: string;
  location: string;
}

export interface FooterConfig {
  companyDescription: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: { platform: string; url: string }[];
  quickLinks: { name: string; url: string }[];
}

export interface ContactConfig {
  address: string[];
  phone: string;
  email: string;
  emergencyPhone: string;
  hours: { days: string; time: string }[];
  timeSlots: string[];
}

export interface Booking {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  vehicle: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface Stat {
  _id?: string;
  key: string;
  value: string;
  label: string;
  sortOrder: number;
}

export interface NewsletterSubscriber {
  _id?: string;
  email: string;
  subscribedAt?: string;
  isActive: boolean;
}

export interface GoogleReviewCache {
  _id?: string;
  placeId: string;
  overallRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  lastFetched: string;
}

export interface GoogleReview {
  authorName: string;
  authorPhoto: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
}

export interface Feedback {
  _id?: string;
  name: string;
  email: string;
  rating: number;
  service: string;
  feedback: string;
  status: 'pending' | 'approved' | 'rejected';
  promotedToTestimonial: boolean;
  createdAt?: string;
}

export interface AdminUser {
  _id?: string;
  username: string;
  passwordHash: string;
  createdAt?: string;
  lastLogin?: string;
}

// API response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

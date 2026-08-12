// ============================================================
// Frontend API Client — centralized access to all API endpoints
// ============================================================

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==================== Public APIs ====================

export const publicApi = {
  getServices: () => request<any>('/services'),
  getTestimonials: () => request<any>('/testimonials'),
  getBlogPosts: () => request<any>('/blog-posts'),
  getSiteConfig: () => request<any>('/site-config'),
  getStats: () => request<any>('/stats'),
  getGoogleReviews: () => request<any>('/google-reviews'),

  submitBooking: (data: any) =>
    request<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  subscribeNewsletter: (email: string) =>
    request<any>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  submitFeedback: (data: any) =>
    request<any>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== Admin APIs ====================

export const adminApi = {
  // Auth
  login: (username: string, password: string) =>
    request<any>('/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Services
  getServices: () => request<any>('/admin/services'),
  createService: (data: any) =>
    request<any>('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (data: any) =>
    request<any>('/admin/services', { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (_id: string) =>
    request<any>('/admin/services', { method: 'DELETE', body: JSON.stringify({ _id }) }),

  // Blog Posts
  getBlogPosts: () => request<any>('/admin/blog-posts'),
  createBlogPost: (data: any) =>
    request<any>('/admin/blog-posts', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (data: any) =>
    request<any>('/admin/blog-posts', { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlogPost: (_id: string) =>
    request<any>('/admin/blog-posts', { method: 'DELETE', body: JSON.stringify({ _id }) }),

  // Testimonials
  getTestimonials: () => request<any>('/admin/testimonials'),
  createTestimonial: (data: any) =>
    request<any>('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  updateTestimonial: (data: any) =>
    request<any>('/admin/testimonials', { method: 'PUT', body: JSON.stringify(data) }),
  deleteTestimonial: (_id: string) =>
    request<any>('/admin/testimonials', { method: 'DELETE', body: JSON.stringify({ _id }) }),
  promoteFeedback: (feedbackId: string) =>
    request<any>('/admin/testimonials', {
      method: 'PUT',
      body: JSON.stringify({ promoteFeedbackId: feedbackId }),
    }),

  // Site Config
  getSiteConfig: () => request<any>('/admin/site-config'),
  updateSiteConfig: (section: string, data: any) =>
    request<any>('/admin/site-config', {
      method: 'PUT',
      body: JSON.stringify({ section, data }),
    }),

  // Stats
  getStats: () => request<any>('/admin/stats'),
  updateStat: (data: any) =>
    request<any>('/admin/stats', { method: 'PUT', body: JSON.stringify(data) }),

  // Bookings
  getBookings: () => request<any>('/admin/bookings'),
  updateBookingStatus: (_id: string, status: string) =>
    request<any>('/admin/bookings', {
      method: 'PUT',
      body: JSON.stringify({ _id, status }),
    }),

  // Newsletter
  getSubscribers: () => request<any>('/admin/newsletter'),
  deleteSubscriber: (_id: string) =>
    request<any>('/admin/newsletter', { method: 'DELETE', body: JSON.stringify({ _id }) }),

  // Image Upload
  getUploadSignature: (folder?: string) =>
    request<any>('/upload', {
      method: 'POST',
      body: JSON.stringify({ folder }),
    }),

  deleteImage: (publicId: string) =>
    request<any>('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ publicId }),
    }),
};

// ==================== Cloudinary Direct Upload ====================

export async function uploadToCloudinary(
  file: File,
  folder: string = 'sundar_service_station'
): Promise<{ url: string; publicId: string }> {
  // Get signed upload params from our API
  const { data: sig } = await adminApi.getUploadSignature(folder);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('timestamp', sig.timestamp.toString());
  formData.append('signature', sig.signature);
  formData.append('api_key', sig.apiKey);
  formData.append('folder', sig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const result = await response.json();
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

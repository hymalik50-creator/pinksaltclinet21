import axios, { AxiosError, AxiosInstance } from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const ADMIN_TOKEN_KEY = 'hps_admin_token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// Public endpoints
export const publicApi = {
  getProducts: (params?: Record<string, unknown>) =>
    api.get('/products', { params }).then((r) => r.data),
  getProduct: (slug: string) =>
    api.get(`/products/${slug}`).then((r) => r.data),
  getCategories: () => api.get('/categories').then((r) => r.data),
  getBlogPosts: () => api.get('/blog').then((r) => r.data),
  getBlogPost: (slug: string) =>
    api.get(`/blog/${slug}`).then((r) => r.data),
  submitInquiry: (data: Record<string, unknown>) => {
    // Map frontend field names to backend field names
    const mappedData = {
      customerName: data.name,
      companyName: data.company || '',
      email: data.email,
      phone: data.phone || '',
      country: data.country || '',
      quantity: data.quantity || '',
      packaging: data.packagingRequirement || '',
      message: data.message || '',
      productId: data.productId || null,
    };
    return api.post('/inquiries', mappedData).then((r) => r.data);
  },
  submitContact: (data: Record<string, unknown>) =>
    api.post('/contact', data).then((r) => r.data),
};

// Admin endpoints
export const adminApi = {
  login: (email: string, password: string) =>
    api.post('/admin/login', { email, password }).then((r) => r.data),
  logout: () => api.post('/admin/logout').then((r) => r.data),
  getSession: () => api.get('/admin/session').then((r) => r.data),
  
  // Products
  getProducts: (params?: Record<string, unknown>) =>
    api.get('/admin/products', { params }).then((r) => {
      console.log('✅ getProducts API response:', JSON.stringify(r.data, null, 2));
      return r.data;
    }),
  getProduct: (id: string) =>
    api.get(`/admin/products/${id}`).then((r) => r.data),
  createProduct: (data: Record<string, unknown>) =>
    api.post('/admin/products', data).then((r) => r.data),
  updateProduct: (id: string, data: Record<string, unknown>) =>
    api.put(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data),
  
  // Images
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api
      .post('/admin/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => {
        // Backend returns: { success, message, data: { imageUrl, displayUrl, ... } }
        return {
          url: r.data.data.imageUrl || r.data.data.displayUrl,
          ...r.data.data
        };
      });
  },
  
  // Categories
  getCategories: (params?: Record<string, unknown>) =>
    api.get('/admin/categories', { params }).then((r) => {
      console.log('✅ getCategories API response:', JSON.stringify(r.data, null, 2));
      return r.data;
    }),
  getCategory: (id: string) =>
    api.get(`/admin/categories/${id}`).then((r) => r.data),
  createCategory: (data: Record<string, unknown>) =>
    api.post('/admin/categories', data).then((r) => r.data),
  updateCategory: (id: string, data: Record<string, unknown>) =>
    api.put(`/admin/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: string) =>
    api.delete(`/admin/categories/${id}`).then((r) => r.data),
  
  // Inquiries
  getInquiries: (params?: Record<string, unknown>) =>
    api.get('/admin/inquiries', { params }).then((r) => {
      console.log('✅ getInquiries API response:', JSON.stringify(r.data, null, 2));
      return r.data;
    }),
  getInquiry: (id: string) =>
    api.get(`/admin/inquiries/${id}`).then((r) => r.data),
  updateInquiryStatus: (id: string, status: string) =>
    api.put(`/admin/inquiries/${id}/status`, { status }).then((r) => {
      console.log('✅ updateInquiryStatus API response:', JSON.stringify(r.data, null, 2));
      return r.data;
    }),
  deleteInquiry: (id: string) =>
    api.delete(`/admin/inquiries/${id}`).then((r) => {
      console.log('✅ deleteInquiry API response:', JSON.stringify(r.data, null, 2));
      return r.data;
    }),
  
  // Contacts
  getContacts: (params?: Record<string, unknown>) =>
    api.get('/admin/contact', { params }).then((r) => r.data),
  getContact: (id: string) =>
    api.get(`/admin/contact/${id}`).then((r) => r.data),
  deleteContact: (id: string) =>
    api.delete(`/admin/contact/${id}`).then((r) => r.data),
  
  // Stats
  getStats: () => api.get('/admin/stats').then((r) => {
    console.log('✅ getStats API response:', JSON.stringify(r.data, null, 2));
    return r.data;
  }),
};

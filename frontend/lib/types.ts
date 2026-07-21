export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category?: string;
  shortDescription: string;
  fullDescription: string;
  description?: string;
  images: ProductImage[];
  isFeatured: boolean;
  featured?: boolean;
  isPublished: boolean;
  published?: boolean;
  origin: string;
  usage: string;
  packaging: string[];
  sizes: string[];
  availability: boolean;
  minimumOrderQuantity: string;
  specifications: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  displayUrl: string;
  thumbnailUrl: string;
  deleteUrl: string;
  altText?: string;
  isPrimary: boolean;
  createdAt: any;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  image?: string;
  isPublished: boolean;
  productCount?: number;
  createdAt: any;
  updatedAt: any;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  category?: string;
  isFeatured?: boolean;
  featured?: boolean;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  limit?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Inquiry {
  id: string;
  productId?: string;
  productName?: string;
  customerName: string;
  name?: string;
  companyName?: string;
  company?: string;
  email: string;
  phone: string;
  country: string;
  quantity: string;
  packaging?: string;
  packagingRequirement?: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived' | 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: any;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role?: 'admin' | 'editor';
}

export interface AdminSession {
  admin: AdminUser;
  token: string;
}

export interface DashboardStats {
  totalProducts: number;
  featuredProducts: number;
  totalInquiries: number;
  newInquiries: number;
  totalCategories: number;
  publishedProducts: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

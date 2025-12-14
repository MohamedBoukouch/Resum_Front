/**
 * API Configuration and Endpoints
 * Consolidates all backend/frontend communication
 * Usage: import { authAPI, summarizationAPI, profileAPI } from '@/lib/api'
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const authAPI = {
  /**
   * User login
   * POST /api/auth/login
   */
  login: async (credentials: { email: string; password: string }) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  /**
   * User signup
   * POST /api/auth/signup
   */
  signup: async (userData: {
    name: string
    email: string
    password: string
  }) => {
    return fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  /**
   * User logout
   * POST /api/auth/logout
   */
  logout: async () => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    })
  },

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser: async () => {
    return fetchAPI("/auth/me", {
      method: "GET",
    })
  },

  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  refreshToken: async () => {
    return fetchAPI("/auth/refresh", {
      method: "POST",
    })
  },

  /**
   * Change password
   * POST /api/auth/change-password
   */
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    return fetchAPI("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// ============================================================================
// SUMMARIZATION ENDPOINTS
// ============================================================================

export const summarizationAPI = {
  /**
   * Generate summary from text
   * POST /api/summarization/generate
   */
  generateSummary: async (data: {
    text: string
    summaryLength?: "short" | "medium" | "long"
    language?: string
  }) => {
    return fetchAPI("/summarization/generate", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Upload and summarize file
   * POST /api/summarization/upload
   */
  uploadAndSummarize: async (
    file: File,
    options?: {
      summaryLength?: "short" | "medium" | "long"
    },
  ) => {
    const formData = new FormData()
    formData.append("file", file)
    if (options?.summaryLength) {
      formData.append("summaryLength", options.summaryLength)
    }

    return fetchAPI("/summarization/upload", {
      method: "POST",
      body: formData,
      skipContentType: true,
    })
  },

  /**
   * Get summarization history
   * GET /api/summarization/history?page=1&limit=10
   */
  getHistory: async (page = 1, limit = 10) => {
    return fetchAPI(`/summarization/history?page=${page}&limit=${limit}`, {
      method: "GET",
    })
  },

  /**
   * Get single summary
   * GET /api/summarization/:id
   */
  getSummary: async (id: string) => {
    return fetchAPI(`/summarization/${id}`, {
      method: "GET",
    })
  },

  /**
   * Delete summary
   * DELETE /api/summarization/:id
   */
  deleteSummary: async (id: string) => {
    return fetchAPI(`/summarization/${id}`, {
      method: "DELETE",
    })
  },

  /**
   * Share summary
   * POST /api/summarization/:id/share
   */
  shareSummary: async (
    id: string,
    data: {
      email?: string
      link?: boolean
    },
  ) => {
    return fetchAPI(`/summarization/${id}/share`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Save summary to collections
   * POST /api/summarization/:id/save
   */
  saveSummary: async (id: string, collectionId?: string) => {
    return fetchAPI(`/summarization/${id}/save`, {
      method: "POST",
      body: JSON.stringify({ collectionId }),
    })
  },
}

// ============================================================================
// PROFILE ENDPOINTS
// ============================================================================

export const profileAPI = {
  /**
   * Get user profile
   * GET /api/profile
   */
  getProfile: async () => {
    return fetchAPI("/profile", {
      method: "GET",
    })
  },

  /**
   * Update user profile
   * PUT /api/profile
   */
  updateProfile: async (data: {
    name?: string
    email?: string
    phone?: string
    bio?: string
    avatar?: string
  }) => {
    return fetchAPI("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  /**
   * Upload avatar
   * POST /api/profile/avatar
   */
  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append("avatar", file)

    return fetchAPI("/profile/avatar", {
      method: "POST",
      body: formData,
      skipContentType: true,
    })
  },

  /**
   * Get notification preferences
   * GET /api/profile/preferences
   */
  getPreferences: async () => {
    return fetchAPI("/profile/preferences", {
      method: "GET",
    })
  },

  /**
   * Update notification preferences
   * PUT /api/profile/preferences
   */
  updatePreferences: async (data: {
    emailNotifications?: boolean
    summaryAlerts?: boolean
    weeklyDigest?: boolean
    marketingEmails?: boolean
    publicProfile?: boolean
    shareSummaries?: boolean
    usageAnalytics?: boolean
  }) => {
    return fetchAPI("/profile/preferences", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete account
   * DELETE /api/profile
   */
  deleteAccount: async (password: string) => {
    return fetchAPI("/profile", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    })
  },
}

// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

export const analyticsAPI = {
  /**
   * Get analytics dashboard data
   * GET /api/analytics/dashboard
   */
  getDashboardStats: async () => {
    return fetchAPI("/analytics/dashboard", {
      method: "GET",
    })
  },

  /**
   * Get summarization statistics
   * GET /api/analytics/summarization?period=30d
   */
  getSummarizationStats: async (period: "7d" | "30d" | "90d" | "all" = "30d") => {
    return fetchAPI(`/analytics/summarization?period=${period}`, {
      method: "GET",
    })
  },

  /**
   * Get word frequency analysis
   * GET /api/analytics/word-frequency/:summaryId
   */
  getWordFrequency: async (summaryId: string) => {
    return fetchAPI(`/analytics/word-frequency/${summaryId}`, {
      method: "GET",
    })
  },

  /**
   * Get compression statistics
   * GET /api/analytics/compression?period=30d
   */
  getCompressionStats: async (period: "7d" | "30d" | "90d" | "all" = "30d") => {
    return fetchAPI(`/analytics/compression?period=${period}`, {
      method: "GET",
    })
  },
}

// ============================================================================
// COLLECTIONS ENDPOINTS
// ============================================================================

export const collectionsAPI = {
  /**
   * Get all collections
   * GET /api/collections
   */
  getCollections: async () => {
    return fetchAPI("/collections", {
      method: "GET",
    })
  },

  /**
   * Create collection
   * POST /api/collections
   */
  createCollection: async (data: {
    name: string
    description?: string
  }) => {
    return fetchAPI("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  /**
   * Update collection
   * PUT /api/collections/:id
   */
  updateCollection: async (
    id: string,
    data: {
      name?: string
      description?: string
    },
  ) => {
    return fetchAPI(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete collection
   * DELETE /api/collections/:id
   */
  deleteCollection: async (id: string) => {
    return fetchAPI(`/collections/${id}`, {
      method: "DELETE",
    })
  },

  /**
   * Add summary to collection
   * POST /api/collections/:id/summaries
   */
  addToCollection: async (collectionId: string, summaryId: string) => {
    return fetchAPI(`/collections/${collectionId}/summaries`, {
      method: "POST",
      body: JSON.stringify({ summaryId }),
    })
  },

  /**
   * Remove summary from collection
   * DELETE /api/collections/:id/summaries/:summaryId
   */
  removeFromCollection: async (collectionId: string, summaryId: string) => {
    return fetchAPI(`/collections/${collectionId}/summaries/${summaryId}`, {
      method: "DELETE",
    })
  },
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

interface FetchOptions extends RequestInit {
  skipContentType?: boolean
}

/**
 * Generic fetch wrapper with error handling and auth token injection
 */
async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { skipContentType = false, headers = {}, ...fetchOptions } = options

  const token = getAuthToken()
  const defaultHeaders: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  // Set Content-Type unless explicitly skipped (for FormData)
  if (!skipContentType && !(fetchOptions.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  return handleResponse(response)
}

/**
 * Handle API response with error processing
 */
async function handleResponse(response: Response) {
  let data

  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    // Handle auth errors
    if (response.status === 401) {
      clearAuthToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    throw new APIError(data?.message || "An error occurred", response.status, data)
  }

  return data
}

/**
 * Custom API Error class for consistent error handling
 */
export class APIError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data: any) {
    super(message)
    this.name = "APIError"
    this.status = status
    this.data = data
  }
}

// ============================================================================
// AUTH TOKEN MANAGEMENT
// ============================================================================

const TOKEN_KEY = "auth_token"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Summary {
  id: string
  title: string
  originalText: string
  summaryText: string
  wordCount: number
  summaryWordCount: number
  compressionRatio: number
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  title: string
  createdAt: string
  wordCount: number
  summaryLength: string
  status: "completed" | "processing"
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

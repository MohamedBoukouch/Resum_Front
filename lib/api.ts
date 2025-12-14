const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

// ============================
// AUTH API
// ============================

export const authAPI = {
  signup: async (data: {
    email: string
    username: string
    password: string
    full_name: string
  }) => {
    return fetchAPI("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: async (credentials: { username: string; password: string }) => {
    const formData = new URLSearchParams()
    formData.append("username", credentials.username)
    formData.append("password", credentials.password)

    return fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }).then(handleResponse)
  },

  me: async () => {
    return fetchAPI("/api/auth/me", { method: "GET" })
  },

  logout: () => {
    clearAuthToken()
  },
}

// ============================
// FETCH WRAPPER
// ============================

async function fetchAPI(endpoint: string, options: RequestInit) {
  const token = getAuthToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return handleResponse(response)
}

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong")
  }

  return data
}

// ============================
// TOKEN STORAGE
// ============================

const TOKEN_KEY = "access_token"

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getAuthToken = () => {
  return typeof window !== "undefined"
    ? localStorage.getItem(TOKEN_KEY)
    : null
}

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

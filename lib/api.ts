const API_BASE_URL = "http://127.0.0.1:8000/api"

// --------------------
// Token Storage
// --------------------
export const saveToken = (token: string) => localStorage.setItem("token", token)
export const getToken = () => localStorage.getItem("token")
export const removeToken = () => localStorage.removeItem("token")

// --------------------
// User Storage
// --------------------
export const saveUser = (user: Record<string, any>) =>
  localStorage.setItem("user", JSON.stringify(user))

export const getUser = () => {
  const user = localStorage.getItem("user")
  if (!user) return null
  try {
    return JSON.parse(user)
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

export const removeUser = () => localStorage.removeItem("user")

// --------------------
// Fetch helper with token
// --------------------
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })

  if (!res.ok) {
    const errData = await res.json().catch(() => null)
    throw new Error(errData?.detail || "API Error")
  }

  return res.json()
}

// --------------------
// Auth API
// --------------------
export const authAPI = {
  signup: async (data: { 
    email: string; 
    username: string; 
    password: string; 
    full_name: string 
  }) => fetchAPI("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: async (data: { username: string; password: string }) =>
    fetchAPI("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: async () => fetchAPI("/auth/me"),

  changePassword: async (data: { old_password: string; new_password: string }) =>
    fetchAPI("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),

    deleteAccount: async () =>
    fetchAPI("/users/me", { method: "DELETE" }),
}

// --------------------
// User API
// --------------------

export const userAPI = {
  updateMe: async (data: Record<string, any>) =>
    fetchAPI("/users/me", { method: "PUT", body: JSON.stringify(data) }),


}

// --------------------
// Summarization API
// --------------------
export const summarizationAPI = {
  generateSummary: async (data: {
  text: string
  mode?: "summary" | "explanation" | "analysis" | "key_points" | "eli5"
  max_words?: number
  user_prompt?: string
}) =>
  fetchAPI("/summarization/generate", {
    method: "POST",
    body: JSON.stringify({
      text: data.text,
      mode: data.mode || "summary",
      max_words: data.max_words || 200,
      user_prompt: data.user_prompt,
    }),
  }),

  getHistory: async (params?: { skip?: number; limit?: number }) => {
  const queryParams = new URLSearchParams()
  if (params?.skip) queryParams.append("skip", params.skip.toString())
  if (params?.limit) queryParams.append("limit", params.limit.toString())
  
  const query = queryParams.toString()
  return fetchAPI(`/summarization/history${query ? `?${query}` : ""}`)
},

  getSummary: async (id: string) => fetchAPI(`/summarization/${id}`),
  

  deleteSummary: async (id: string) =>
    fetchAPI(`/summarization/${id}`, { method: "DELETE" }),

  uploadFile: async (data: {
  file: File
  mode?: "summary" | "explanation" | "analysis" | "key_points" | "eli5"
  max_words?: number
  user_prompt?: string
}) => {
  const formData = new FormData()
  formData.append("file", data.file)
  
  // Add optional parameters as form fields
  if (data.mode) formData.append("mode", data.mode)
  if (data.max_words) formData.append("max_words", data.max_words.toString())
  if (data.user_prompt) formData.append("user_prompt", data.user_prompt)

  const token = getToken()
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_BASE_URL}/summarization/upload`, {
    method: "POST",
    body: formData,
    headers,
  })

  if (!res.ok) {
    const errData = await res.json().catch(() => null)
    throw new Error(errData?.detail || "API Error")
  }

  return res.json()
},
}
import axios from 'axios'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const cleanBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl
const resolvedApiUrl = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`
const resolvedApiOrigin = resolvedApiUrl.replace(/\/api\/?$/, '')

const api = axios.create({
  baseURL: resolvedApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adminToken')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export function getImageUrl(imageUrl) {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  return `${resolvedApiOrigin}${imageUrl}`
}

export async function getInvitationBySlug(slug) {
  const response = await api.get(`/public/invitations/${slug}`)
  return response.data
}

export async function getRsvpByToken(slug, token) {
  const response = await api.get(`/public/rsvp/${slug}/${token}`)
  return response.data
}

export async function getPublicPhotos(slug) {
  const response = await api.get(`/public/invitations/${slug}/photos`)
  return response.data
}

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export async function getAdminOverview(token) {
  const response = await api.get('/admin/overview', { headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

export async function uploadWeddingPhoto(weddingId, file, caption, section, token) {
  const formData = new FormData()
  formData.append('file', file)
  if (caption) formData.append('caption', caption)
  formData.append('section', section)
  const response = await api.post(`/weddings/${weddingId}/photos/upload`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': undefined },
  })
  return response.data
}

export async function uploadWeddingDressCodeImage(weddingId, file, token) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post(`/weddings/${weddingId}/dress-code-image/upload`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': undefined },
  })
  return response.data
}

export async function uploadWeddingLogo(weddingId, file, token) {
  const formData = new FormData()
  formData.append('file', file)
  const currentToken = token || sessionStorage.getItem('adminToken')
  const response = await api.post(`/weddings/${weddingId}/logo/upload`, formData, {
    headers: { Authorization: `Bearer ${currentToken}`, 'Content-Type': undefined },
  })
  return response.data
}

export async function getMyWeddings(userId, token) {
  const response = await api.get(`/weddings/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getWeddingContent(weddingId, token) {
  const response = await api.get(`/weddings/${weddingId}/content`, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

export async function updateWeddingContent(weddingId, data, token) {
  const response = await api.put(`/weddings/${weddingId}/content`, data, { headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

export async function createWedding(data, token) {
  const response = await api.post('/weddings', data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getPublicAudio(slug) {
  const response = await api.get(`/public/invitations/${slug}/audio`)
  return response.data
}

export async function uploadWeddingAudio(weddingId, file, title, token) {
  const formData = new FormData()
  formData.append('file', file)
  if (title) formData.append('title', title)
  const currentToken = sessionStorage.getItem('adminToken')
  if (!currentToken) {
    const error = new Error('La sesión del panel ya no está disponible.')
    error.code = 'NO_ADMIN_SESSION'
    throw error
  }
  const response = await api.post(`/weddings/${weddingId}/audio/upload`, formData, { headers: { Authorization: `Bearer ${currentToken}` } })
  return response.data
}

export async function deleteWeddingAudio(weddingId, token) {
  const currentToken = token || sessionStorage.getItem('adminToken')
  const response = await api.delete(`/weddings/${weddingId}/audio`, {
    headers: { Authorization: `Bearer ${currentToken}` },
  })
  return response.data
}

export async function getManagedPhotos(weddingId, token) {
  const response = await api.get(`/weddings/${weddingId}/photos`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteWeddingPhoto(weddingId, photoId, token) {
  await api.delete(`/weddings/${weddingId}/photos/${photoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getGuestGroups(weddingId, token) {
  const response = await api.get(`/weddings/${weddingId}/guest-groups`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createGuestGroup(weddingId, data, token) {
  const response = await api.post(`/weddings/${weddingId}/guest-groups`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function submitRsvp(slug, token, payload) {
  const response = await api.post(`/public/rsvp/${slug}/${token}`, payload)
  return response.data
}

export async function createAdminUser(userData, token) {
  const response = await api.post('/admin/users', userData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteAdminUser(userId, token) {
  const response = await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function toggleCheckInAdmin(weddingId, payload, token) {
  const response = await api.post(`/weddings/${weddingId}/guest-groups/checkin/toggle`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function getDoorAccessData(slug, doorKey) {
  const response = await api.get(`/public/door-access/${slug}/${doorKey}`)
  return response.data
}

export async function toggleDoorCheckInPublic(slug, doorKey, payload) {
  const response = await api.post(`/public/door-access/${slug}/${doorKey}/toggle`, payload)
  return response.data
}

export default api

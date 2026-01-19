/**
 * API client for RiseUp backend
 */

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth endpoints
export const authAPI = {
  register: (data: { 
    email: string; 
    password: string; 
    name: string; 
    profile_type: string;
    bio?: string;
    location?: string;
    causes?: string[];
  }) =>
    api.post('/auth/register', data).then(res => res.data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(res => res.data),
  logout: () =>
    api.post('/auth/logout'),
}

// Profile endpoints
export const profileAPI = {
  getMyProfile: () => api.get('/profiles/me'),
  updateProfile: (data: any) => api.patch('/profiles/me', data),
  getProfile: (id: number) => api.get(`/profiles/${id}`),
  getProfileEvents: (id: number) => api.get(`/profiles/${id}/events`),
  getMyAttendingEvents: () => api.get('/profiles/me/attending'),
}

// Event endpoints
export const eventAPI = {
  create: (data: any) => api.post('/events', data),
  list: () => api.get('/events'),
  listMap: () => api.get('/events/map'),
  get: (id: number) => api.get(`/events/${id}`),
  join: (id: number) => api.post(`/events/${id}/join`),
  leave: (id: number) => api.delete(`/events/${id}/leave`),
  getAttendees: (id: number) => api.get(`/events/${id}/attendees`),
}

// Post endpoints
export const postAPI = {
  create: (data: any) => api.post('/posts', data),
  get: (id: number) => api.get(`/posts/${id}`),
}

// Reaction endpoints
export const reactionAPI = {
  add: (data: any) => api.post('/reactions', data),
  remove: (targetType: string, targetId: number) =>
    api.delete('/reactions', { params: { target_type: targetType, target_id: targetId } }),
  getEventReactions: (id: number) => api.get(`/reactions/events/${id}`),
  getPostReactions: (id: number) => api.get(`/reactions/posts/${id}`),
}

// Feed endpoints
export const feedAPI = {
  get: (limit?: number) => api.get('/feed', { params: { limit } }),
}

// Unionized endpoints
export const unionizedAPI = {
  list: (params?: {
    skip?: number;
    limit?: number;
    location?: string;
    employment_type?: string;
    union_status?: string;
  }) => api.get('/unionized', { params }),
  get: (id: number) => api.get(`/unionized/${id}`),
  create: (data: any) => api.post('/unionized', data),
}

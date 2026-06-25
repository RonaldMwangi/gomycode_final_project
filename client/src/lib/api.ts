import type { AuthResponse, Task, TasksResponse } from '../types/api'

const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '')

export function getHealthUrl() {
  return `${apiUrl}/health`
}

export async function signup(payload: {
  name?: string
  email: string
  password: string
}) {
  const res = await fetch(`${apiUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Signup failed')
  }

  return (await res.json()) as AuthResponse
}

export async function login(payload: {
  email: string
  password: string
}) {
  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Login failed')
  }

  return (await res.json()) as AuthResponse
}

export async function listTasks(token: string) {
  const res = await fetch(`${apiUrl}/api/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to load tasks')
  }

  return (await res.json()) as TasksResponse
}

export async function createTask(token: string, payload: {
  title: string
  description?: string
  deadline?: string
  status?: 'todo' | 'in_progress' | 'completed'
  priority?: number
}) {
  const res = await fetch(`${apiUrl}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to create task')
  }

  const data = (await res.json()) as { task: Task }
  return data.task
}

export async function updateTask(token: string, id: string, payload: {
  title?: string
  description?: string
  deadline?: string
  status?: 'todo' | 'in_progress' | 'completed'
  priority?: number
}) {
  const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to update task')
  }

  const data = (await res.json()) as { task: Task }
  return data.task
}

export async function deleteTask(token: string, id: string) {
  const res = await fetch(`${apiUrl}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? 'Failed to delete task')
  }

  return true
}


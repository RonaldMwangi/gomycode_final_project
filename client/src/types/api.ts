export type AuthResponse = {
  token: string
  user: {
    id: string
    name?: string
    email: string
  }
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed'

export type Task = {
  _id: string
  userId: string
  title: string
  description?: string
  deadline?: string | Date
  status?: TaskStatus
  priority?: number
  createdAt?: string
  updatedAt?: string
}

export type TasksResponse = {
  tasks: Task[]
}


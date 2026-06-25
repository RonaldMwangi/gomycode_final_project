import type { Request, Response } from 'express'

import { Task } from '../models/Task.js'

export async function createTask(req: Request, res: Response) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const { title, description, deadline, status, priority } = req.body as {
    title?: string
    description?: string
    deadline?: string
    status?: 'todo' | 'in_progress' | 'completed'
    priority?: number
  }

  if (!title) {
    return res.status(400).json({ message: 'title is required' })
  }

  const task = await Task.create({
    userId,
    title: String(title),
    description: description ? String(description) : undefined,
    deadline: deadline ? new Date(deadline) : undefined,
    status,
    priority,
  })

  return res.status(201).json({ task })
}

export async function listTasks(req: Request, res: Response) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const tasks = await Task.find({ userId })
  return res.status(200).json({ tasks })
}

export async function updateTask(req: Request, res: Response) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.params
  const { title, description, deadline, status, priority } = req.body as {
    title?: string
    description?: string
    deadline?: string
    status?: 'todo' | 'in_progress' | 'completed'
    priority?: number
  }


  const task = await Task.findOne({ _id: id, userId })
  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  if (title !== undefined) task.title = String(title)
  if (description !== undefined) task.description = description ? String(description) : undefined
  if (deadline !== undefined) task.deadline = deadline ? new Date(deadline) : undefined
  if (status !== undefined) task.status = status as any
  if (priority !== undefined) task.priority = priority

  await task.save()
  return res.status(200).json({ task })
}

export async function deleteTask(req: Request, res: Response) {
  const userId = req.user?.userId
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })

  const { id } = req.params

  const deleted = await Task.findOneAndDelete({ _id: id, userId })
  if (!deleted) {
    return res.status(404).json({ message: 'Task not found' })
  }

  return res.status(200).json({ message: 'Task deleted' })
}



import type { Request, Response } from 'express'

import bcrypt from 'bcryptjs'

import { getEnv } from '../config/env.js'
import { signToken } from '../utils/token.js'
import { User } from '../models/User.js'

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body as {
    name?: string
    email?: string
    password?: string
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters' })
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) {
    return res.status(409).json({ message: 'email already in use' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.create({
    name: name ? String(name) : undefined,
    email: normalizedEmail,
    passwordHash,
  })

  const token = signToken(
    { userId: user._id.toString() },
    getEnv('JWT_SECRET'),
    getEnv('JWT_EXPIRES_IN')
  )

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  const normalizedEmail = String(email).toLowerCase().trim()

  const user = await User.findOne({ email: normalizedEmail })
  if (!user) {
    return res.status(401).json({ message: 'invalid credentials' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ message: 'invalid credentials' })
  }

  const token = signToken(
    { userId: user._id.toString() },
    getEnv('JWT_SECRET'),
    getEnv('JWT_EXPIRES_IN')
  )

  return res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  })
}



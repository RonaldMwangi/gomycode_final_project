import type { NextFunction, Request, Response } from 'express'

import { getEnv } from '../config/env.js'
import { verifyToken } from '../utils/token.js'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const secret = getEnv('JWT_SECRET')

    const decoded = verifyToken(token, secret)
    req.user = { userId: decoded.userId as any }

    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}



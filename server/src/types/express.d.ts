import 'express'

import type { Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: Types.ObjectId
      }
    }
  }
}

export {}


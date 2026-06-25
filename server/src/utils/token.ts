import jwt from 'jsonwebtoken'

export type JwtPayload = {
  userId: string
}

export function signToken(payload: JwtPayload, secret: string, expiresIn: string | number) {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions)
}

export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as JwtPayload
}


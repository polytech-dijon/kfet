import jwt from "jsonwebtoken"
import type { NextApiRequest, NextApiResponse } from "next"

export type verifyJwtProps = {
  req: NextApiRequest,
  res: NextApiResponse,
  verifyBodyData?: boolean,
}
export default function verifyJwt({ req, res, verifyBodyData }: verifyJwtProps): boolean {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(400).json({ ok: false, error: 'No token provided' })
    return false
  }

  const token = (authorization.match('JWT (.*)') || '')[1].trim()
  try {
    jwt.verify(token, process.env.JWT_SECRET || '')
  }
  catch {
    res.status(400).json({ ok: false, error: 'Invalid token' })
    return false
  }

  if (verifyBodyData) {
    const { data } = req.body
    if (!data) {
      res.status(400).json({ ok: false, error: 'Invalid data' })
      return false
    }
  }

  return true
}
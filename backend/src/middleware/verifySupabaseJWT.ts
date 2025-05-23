// backend/src/middleware/verifySupabaseJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

const client = jwksRsa({
  jwksUri: process.env.SUPABASE_JWKS_URI!,
});

export function verifySupabaseJWT() {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        return res.status(401).json({ error: 'Invalid Supabase JWT' });
      }
      (req as any).auth = decoded;
      next();
    });
  };
}

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}
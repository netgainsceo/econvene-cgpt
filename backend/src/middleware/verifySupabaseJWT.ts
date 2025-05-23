import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';

// Supabase JWKS endpoint
const client = jwksRsa({
  jwksUri: process.env.SUPABASE_JWKS_URI!,
});

export interface AuthPayload {
  sub: string;      // user id
  email?: string;
  role?: string;
}

export function verifySupabaseJWT() {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const token = header.split(' ')[1];

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      (req as any).auth = decoded as AuthPayload;
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

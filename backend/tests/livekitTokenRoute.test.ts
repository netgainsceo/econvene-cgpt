// Jest test for /livekit/token route (simplified)
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { verifySupabaseJWT } from '../src/middleware/verifySupabaseJWT';
import livekitRoute from '../src/routes/livekit';

const app = express();
app.use(express.json());
app.use(livekitRoute);

// Mock middleware to bypass JWKS fetch in tests
jest.mock('../src/middleware/verifySupabaseJWT', () => ({
  verifySupabaseJWT: () => (req: any, _res: any, next: any) => {
    req.auth = { sub: '00000000-0000-0000-0000-000000000001' };
    next();
  },
}));

describe('/livekit/token', () => {
  it('returns 403 if user not allowed', async () => {
    const res = await request(app).post('/livekit/token').send({ roomName: 'no-access' });
    expect(res.status).toBe(403);
  });
});

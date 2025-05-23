import express from 'express';
import { Pool } from 'pg';
import { AccessToken } from 'livekit-server-sdk';
import { verifySupabaseJWT } from '../middleware/verifySupabaseJWT';

const router = express.Router();
const db = new Pool();

const API_KEY = process.env.LIVEKIT_API_KEY!;
const API_SECRET = process.env.LIVEKIT_API_SECRET!;

router.post('/livekit/token', verifySupabaseJWT(), async (req, res) => {
  const { roomName } = req.body;
  const userId = (req as any).auth.sub;

  // Check DB for access
  const { rowCount } = await db.query(
    'SELECT 1 FROM user_room_access WHERE user_id = $1 AND room_name = $2',
    [userId, roomName]
  );

  if (rowCount === 0) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const at = new AccessToken(API_KEY, API_SECRET, { identity: userId });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  res.json({ token: at.toJwt() });
});

export default router;

import express from 'express';
import { Pool } from 'pg';
import { verifySupabaseJWT } from '../middleware/verifySupabaseJWT';

const db = new Pool();
const router = express.Router();

const requireAdmin = (req: any, res: express.Response, next: express.NextFunction) => {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
};

router.use(verifySupabaseJWT(), requireAdmin);

router.get('/admin/user-room-access', async (_req, res) => {
  const users = await db.query('SELECT id FROM auth.users');
  const access = await db.query('SELECT user_id, room_name FROM user_room_access');
  res.json({ users: users.rows, access: access.rows });
});

router.post('/admin/grant-room', async (req, res) => {
  const { userId, roomName } = req.body;
  await db.query(
    'INSERT INTO user_room_access (user_id, room_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, roomName]
  );
  res.sendStatus(204);
});

router.post('/admin/revoke-room', async (req, res) => {
  const { userId, roomName } = req.body;
  await db.query(
    'DELETE FROM user_room_access WHERE user_id = $1 AND room_name = $2',
    [userId, roomName]
  );
  res.sendStatus(204);
});

export default router;

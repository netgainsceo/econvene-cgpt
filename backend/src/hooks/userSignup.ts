// backend/src/hooks/userSignup.ts
import { Pool } from 'pg';
const db = new Pool();

export async function assignDefaultRooms(userId: string) {
  const defaultRooms = ['room1'];
  for (const room of defaultRooms) {
    await db.query(
      'INSERT INTO user_room_access (user_id, room_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, room]
    );
  }
}
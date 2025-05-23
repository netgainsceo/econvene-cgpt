-- SQL: Supabase table for room-level access control
CREATE TABLE IF NOT EXISTS user_room_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, room_name)
);

-- Optional: Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_room ON user_room_access (user_id, room_name);
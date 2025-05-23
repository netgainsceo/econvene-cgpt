-- Core tables
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  uploader_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  path TEXT NOT NULL,
  size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_room_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, room_name)
);

CREATE INDEX IF NOT EXISTS idx_user_room ON user_room_access(user_id, room_name);

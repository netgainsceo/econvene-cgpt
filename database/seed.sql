-- Seed test access records for room authorization
INSERT INTO user_room_access (user_id, room_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'room1'),
  ('00000000-0000-0000-0000-000000000001', 'room2'),
  ('00000000-0000-0000-0000-000000000002', 'room2');
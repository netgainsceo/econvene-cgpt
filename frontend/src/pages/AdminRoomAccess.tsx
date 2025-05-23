// Admin page matrix UI
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminRoomAccess() {
  const [users, setUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<string[]>(['room1', 'room2', 'room3']);
  const [access, setAccess] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    axios
      .get('/admin/user-room-access', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') },
      })
      .then((res) => {
        setUsers(res.data.users);
        const map: Record<string, Set<string>> = {};
        res.data.access.forEach((row: any) => {
          if (!map[row.user_id]) map[row.user_id] = new Set();
          map[row.user_id].add(row.room_name);
        });
        setAccess(map);
      });
  }, []);

  const toggle = async (userId: string, room: string) => {
    const has = access[userId]?.has(room);
    const url = has ? '/admin/revoke-room' : '/admin/grant-room';
    await axios.post(
      url,
      { userId, roomName: room },
      { headers: { Authorization: 'Bearer ' + localStorage.getItem('jwt') } }
    );
    if (!access[userId]) access[userId] = new Set();
    has ? access[userId].delete(room) : access[userId].add(room);
    setAccess({ ...access });
  };

  return (
    <table style={{ margin: '2rem auto', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>User</th>
          {rooms.map((r) => (
            <th key={r}>{r}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            {rooms.map((r) => (
              <td
                key={r}
                onClick={() => toggle(u.id, r)}
                style={{
                  cursor: 'pointer',
                  background: access[u.id]?.has(r) ? '#c8e6c9' : '#ffcdd2',
                }}
              >
                {access[u.id]?.has(r) ? '✅' : '❌'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

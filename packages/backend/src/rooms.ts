import WebSocket from "ws";
import type { PostMessage } from "shared";

export interface ChatRoom {
  id: string;
  members: Set<WebSocket>;
}

const rooms = new Set<ChatRoom>();

// New map: WebSocket -> Room ID
const userRoomMap = new Map<WebSocket, string>();

export function addMemberToRoom(roomId: string, ws: WebSocket) {
  let room = [...rooms].find((room) => room.id === roomId);
  if (!room) {
    room = {
      id: roomId,
      members: new Set(),
    };
    rooms.add(room);
  }

  room.members.add(ws);
  userRoomMap.set(ws, roomId); // Track the user's room
}

export function removeMemberFromRoom(ws: WebSocket) {
  const roomId = userRoomMap.get(ws);
  if (!roomId) return;

  const room = [...rooms].find((r) => r.id === roomId);
  if (!room) return;

  room.members.delete(ws);
  userRoomMap.delete(ws);

  // Optionally delete the room if empty
  if (room.members.size === 0) {
    rooms.delete(room);
  }
}

export function sendMessageToAllPeopleInRoom(
  roomId: string,
  message: PostMessage
) {
  const room = [...rooms].find((room) => room.id === roomId);
  if (!room) return;

  room.members.forEach((user) => {
    user.send(JSON.stringify(message));
  });
}

export function findUserRoom(ws: WebSocket) {
  const roomId = userRoomMap.get(ws);
  if (!roomId) return undefined;

  return [...rooms].find((room) => room.id === roomId);
}

export default rooms;

import WebSocket from "ws";
import type { PostMessage } from "shared";

export interface ChatRoom {
  id: string;
  members: Set<WebSocket>;
}

const rooms = new Set<ChatRoom>();

export function addMemberToRoom(roomId: string, ws: WebSocket) {
  const room = [...rooms].find((room) => room.id === roomId);
  if (!room) {
    rooms.add({
      id: roomId,
      members: new Set([ws]),
    });

    return;
  }

  const roomCopy = structuredClone(room);
  roomCopy.members.add(ws);
  rooms.delete(room);
  rooms.add(roomCopy);
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
  return [...rooms].find((room) => {
    room.members.has(ws);
  });
}

export default rooms;

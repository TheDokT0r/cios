import WebSocket from "ws";
import { ServerAction, type PostMessage } from "shared";
import { getUsername } from "./users";

export interface ChatRoom {
  id: string;
  members: Set<WebSocket>;
  hashedPass?: string;
}

const rooms = new Set<ChatRoom>();

// New map: WebSocket -> Room ID
const userRoomMap = new Map<WebSocket, string>();

export function addMemberToRoom(roomId: string, ws: WebSocket, userIp: string) {
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

  sendMessageToAllPeopleInRoom(roomId, {
    type: ServerAction.USER_JOINED,
    message: roomId,
    date: new Date(),
    username: getUsername(userIp),
  });
}

export function removeMemberFromRoom(ws: WebSocket, username: string) {
  const userRoom = findUserRoom(ws);
  if (!userRoom) return;

  const room = [...rooms].find((r) => r.id === userRoom.id);
  if (!room) return;

  room.members.delete(ws);
  userRoomMap.delete(ws);

  sendMessageToAllPeopleInRoom(userRoom.id, {
    type: ServerAction.USER_LEFT,
    message: "",
    username,
    date: new Date(),
  });

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

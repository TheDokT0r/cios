import WebSocket from "ws";
import { ServerAction, UserAction, type PostMessage } from "shared";
import { v4 as uuidv4 } from "uuid";
import { getUsername } from "./users";

export interface ChatRoom {
  id: string;
  members: Set<WebSocket>;
  password?: string;
}

const rooms = new Set<ChatRoom>();

// New map: WebSocket -> Room ID
const userRoomMap = new Map<WebSocket, string>();

/**
 * Adds a user to a room and notify all of the other members of said room
 */
export function addMemberToRoom(
  roomId: string,
  ws: WebSocket,
  username: string
) {
  let room = getRoom(roomId);
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
    username,
  });
}

/**
 * Removes a user from room and notify all the other members of said room
 */
export function removeMemberFromRoom(ws: WebSocket, username: string) {
  const roomId = userRoomMap.get(ws);
  if (!roomId) return;

  const room = [...rooms].find((r) => r.id === roomId);
  if (!room) return;

  room.members.delete(ws);
  userRoomMap.delete(ws);

  sendMessageToAllPeopleInRoom(roomId, {
    type: ServerAction.USER_LEFT,
    message: `${username} has left the chat`,
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

/**
 * Creates a private room with an hashed password and adds the user to it.
 */
export function createPrivateRoom(
  ws: WebSocket,
  username: string,
  password: string
) {
  let roomId = uuidv4();
  while ([...rooms].filter((room) => room.id === roomId).length > 0) {
    roomId = uuidv4();
  }
  const hashedPassword = Bun.password.hashSync(password, {
    algorithm: "bcrypt",
  });
  const privateRoom: ChatRoom = {
    id: uuidv4(),
    members: new Set(),
    password: hashedPassword,
  };
  rooms.add(privateRoom);

  addMemberToRoom(roomId, ws, username);
}

/**
 * If provided password is valid, it would add the user to the room and notify the other users.
 * If the password is invalid then it would send an error message to the user.
 */
export function joinPrivateRoom(
  ws: WebSocket,
  username: string,
  roomId: string,
  password: string
) {
  const room = getRoom(roomId);
  if (room && room.password) {
    if (Bun.password.verifySync(password, room.password)) {
      addMemberToRoom(roomId, ws, username);
    } else {
      const message: PostMessage = {
        type: ServerAction.ERROR,
        message: "Incorrect password",
        date: new Date(),
        username: "System",
      };

      ws.send(JSON.stringify(message));
    }
  } else {
    const message: PostMessage = {
      type: ServerAction.ERROR,
      message:
        "An error has accrued while trying to connect to room. Please try again later",
      date: new Date(),
      username: "System",
    };

    ws.send(JSON.stringify(message));
  }
}

export const getRoom = (roomId: string) =>
  [...rooms].find((room) => room.id === roomId);

export default rooms;

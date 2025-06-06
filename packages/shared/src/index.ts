export enum UserAction {
  JOIN,
  LEAVE,
  MESSAGE,
  RENAME,
  REMIND_NICK, // Resends to the user his nick
  JOIN_RANDOM,
  CREATE_PRIVATE
}

export interface UserMessage {
  action: UserAction;
  data: string;
}

export enum ServerAction {
  ERROR,
  ROOM_ERROR,
  MESSAGE,
  SERVER_MESSAGE,
  USER_JOINED,
  USER_LEFT,
  NICK,
  HISTORY,
  JOIN_RANDOM,
  CREATE_PRIVATE
}

/**
 * The format that the server uses to send data to the end user
 */
export interface PostMessage {
  type: ServerAction;
  message: string;
  date: Date;
  username: string;
}

export function isRoomNameValid(
  roomName: string
): "empty" | "white spaces" | "ok" {
  if (!roomName.trim()) return "empty";
  if (/\s/.test(roomName)) return "white spaces";
  return "ok";
}

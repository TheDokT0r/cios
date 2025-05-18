export enum UserAction {
  JOIN = "join",
  LEAVE = "leave",
  MESSAGE = "message",
  RENAME = "rename",
  REMIND_NICK = "nick", // Resends to the user his nick
  // PREV_MESSAGES = "prev", // Requests from the server the previous messages of the chat
}

export interface UserMessage {
  action: UserAction;
  data: string;
}

export enum ServerAction {
  ERROR = "error",
  ROOM_ERROR = "room error",
  MESSAGE = "message",
  SERVER_MESSAGE = "server message",
  USER_JOINED = "user joined",
  USER_LEFT = "user left",
  NICK = "nick",
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
): "white spaces" | "empty" | "ok" {
  if (roomName.length === 0) {
    return "empty";
  }

  if (/\s/g.test(roomName)) {
    return "white spaces";
  }

  return "ok";
}

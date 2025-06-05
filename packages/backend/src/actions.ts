import type WebSocket from "ws";
import { getUsername } from "./users";
import {ServerAction, type PostMessage} from 'shared';



export function sendMessageToUser(
  user: WebSocket,
  userIp: string,
  type: ServerAction,
  message: string
) {
  const serverMessage: PostMessage = {
    type,
    message,
    date: new Date(),
    username: getUsername(userIp),
  };

  user.send(JSON.stringify(serverMessage));
}


export function sendInvalidIpError(ws: WebSocket) {
  sendMessageToUser(ws, "", ServerAction.ERROR, "Invalid IP address given");
}

/**
* A function that simplifies sending messages to a user from the system
*/
export function sendSystemMessage(ws: WebSocket, action: ServerAction, message: string, username = "System") {
  const postMessage: PostMessage = {
    type: action,
    message,
    date: new Date(),
    username
  }

  return ws.send(JSON.stringify(postMessage));
}

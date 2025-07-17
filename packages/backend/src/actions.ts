import type WebSocket from "ws";
import {ErrorCodes, ServerAction, type PostMessage} from 'shared';

/**
* A function that simplifies sending messages to a user from the system
*/
export function sendSystemMessage(ws: WebSocket, action: ServerAction, message: string | ErrorCodes = "", username = "System") {
  const postMessage: PostMessage = {
    type: action,
    message,
    date: new Date(),
    username
  }

  return ws.send(JSON.stringify(postMessage));
}

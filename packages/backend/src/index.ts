import { WebSocketServer, WebSocket } from "ws";
import { sendInvalidIpError, sendMessageToUser } from "./actions";
import {
  addMemberToRoom,
  findUserRoom,
  sendMessageToAllPeopleInRoom,
} from "./rooms";
import { getUsername, regenerateUsername } from "./users";
import {
  UserAction,
  type PostMessage,
  ServerAction,
  type UserMessage,
  isRoomNameValid,
} from "shared";

declare module "bun" {
  interface Env {
    PORT: number;
  }
}

const wss = new WebSocketServer({ port: process.env.PORT });
wss.on("connection", (ws, req) => {
  ws.on("error", console.error);

  if (req.socket.remoteAddress) {
    const message: PostMessage = {
      type: ServerAction.NICK,
      message: getUsername(req.socket.remoteAddress),
      date: new Date(),
      username: "System",
    };

    ws.send(JSON.stringify(message));
  }

  ws.on("message", (msg, isBinary) => {
    if (isBinary || !("action" in JSON.parse(msg.toString()))) {
      sendMessageToUser(
        ws,
        req.socket.localAddress || "",
        ServerAction.ERROR,
        "Invalid message type"
      );
    }

    const userIp = req.socket.remoteAddress;
    if (!userIp) {
      return sendInvalidIpError(ws);
    }

    const { action, data }: UserMessage = JSON.parse(msg.toString());
    switch (action) {
      case UserAction.JOIN: {
        if (isRoomNameValid(data) === "ok") {
          addMemberToRoom(data, ws);
        }
        break;
      }
      case UserAction.MESSAGE: {
        const room = findUserRoom(ws);
        if (room) {
          sendMessageToAllPeopleInRoom(room.id, {
            type: ServerAction.MESSAGE,
            message: data,
            date: new Date(),
            username: getUsername(userIp),
          });
        }
        break;
      }
      case UserAction.LEAVE: {
        const room = findUserRoom(ws);
        if (room) {
          const username = getUsername(userIp);
          const message = `${username} has left the chat`;
          sendMessageToAllPeopleInRoom(room.id, {
            type: ServerAction.USER_LEFT,
            message,
            date: new Date(),
            username: "System",
          });
        }
        break;
      }

      case UserAction.RENAME: {
        const newNick = regenerateUsername(userIp);
        const message: PostMessage = {
          type: ServerAction.NICK,
          message: newNick,
          date: new Date(),
          username: "System",
        };

        ws.send(JSON.stringify(message));
        break;
      }

      case UserAction.REMIND_NICK: {
        const message: PostMessage = {
          type: ServerAction.NICK,
          message: getUsername(userIp),
          date: new Date(),
          username: "System",
        };

        ws.send(JSON.stringify(message));
        break;
      }
    }
  });
});

console.log(`Websocket server started on port ${process.env.PORT}`);

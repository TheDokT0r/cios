import { WebSocketServer, WebSocket } from "ws";
import { sendInvalidIpError, sendMessageToUser, sendSystemMessage } from "./actions";
import rooms, {
  addMemberToRoom,
  findUserRoom,
  removeMemberFromRoom,
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
      console.error("Invalid ip");
      return sendInvalidIpError(ws);
    }

    const { action, data }: UserMessage = JSON.parse(msg.toString());
    switch (action) {
      case UserAction.JOIN: {
        const isValid = isRoomNameValid(data)
        if (isValid !== "ok") {
          return sendSystemMessage(ws, ServerAction.ERROR, `Invalid room ID format: ${isValid}`);
        }

        return addMemberToRoom(data, ws, userIp);
      }
      case UserAction.MESSAGE: {
        const room = findUserRoom(ws);
        if (room) {
          sendMessageToAllPeopleInRoom(room.id, {
            type: ServerAction.MESSAGE,
            message: `${getUsername(userIp)} has joined the chat`,
            date: new Date(),
            username: getUsername(userIp),
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

      case UserAction.JOIN_RANDOM: {
        const publicRooms = [...rooms].filter((room) => !room.hashedPass || room.hashedPass.length === 0);
        if (!publicRooms || publicRooms.length === 0) {
          return sendSystemMessage(ws, ServerAction.ERROR, "No public rooms were found");
        }

        const room = publicRooms[Math.floor(Math.random() * publicRooms.length)];
        return addMemberToRoom(room!.id, ws, userIp);
      }
    }

    ws.on("close", () => {
      removeMemberFromRoom(ws, getUsername(userIp));
    });
  });
});

console.log(`Websocket server started on port ${process.env.PORT}`);

import { WebSocketServer, WebSocket } from "ws";
import { sendSystemMessage } from "./actions";
import rooms, {
  addMemberToRoom,
  createPrivateRoom,
  findUserRoom,
  getRoomFromId,
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
  ErrorCodes,
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
      sendSystemMessage(
        ws,
        ServerAction.ERROR,
        ErrorCodes.INVALID_MESSAGE_TYPE
      );
    }

    const userIp = req.socket.remoteAddress;
    if (!userIp) {
      console.error("Invalid ip");
      return sendSystemMessage(ws, ServerAction.ERROR, ErrorCodes.INVALID_IP);
    }

    const { action, data }: UserMessage = JSON.parse(msg.toString());
    switch (action) {
      case UserAction.JOIN: {
        const isValid = isRoomNameValid(data);

        if (isValid !== "ok") {
          return sendSystemMessage(
            ws,
            ServerAction.ERROR,
            ErrorCodes.INVALID_ROOM_ID_FORMAT
          );
        }

        const room = getRoomFromId(data);
        if (room && room.hashedPass) {
          return sendSystemMessage(
            ws,
            ServerAction.ERROR,
            ErrorCodes.INVALID_PASSWORD
          );
        }

        return addMemberToRoom(data, ws, userIp);
      }
      case UserAction.MESSAGE: {
        const room = findUserRoom(ws);
        if (!room) {
          return sendSystemMessage(
            ws,
            ServerAction.ERROR,
            ErrorCodes.NOT_IN_ROOM
          );
        }

        return sendMessageToAllPeopleInRoom(room.id, {
          type: ServerAction.MESSAGE,
          message: `${getUsername(userIp)} has joined the chat`,
          date: new Date(),
          username: getUsername(userIp),
        });
      }

      case UserAction.RENAME: {
        const newNick = regenerateUsername(userIp);
        const message: PostMessage = {
          type: ServerAction.NICK,
          message: newNick,
          date: new Date(),
          username: "System",
        };

        return sendSystemMessage(ws, ServerAction.NICK, newNick);
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
        const publicRooms = [...rooms].filter(
          (room) => !room.hashedPass || room.hashedPass.length === 0
        );
        if (!publicRooms || publicRooms.length === 0) {
          return sendSystemMessage(
            ws,
            ServerAction.ERROR,
            ErrorCodes.NO_PUBLIC_ROOMS
          );
        }

        const room =
          publicRooms[Math.floor(Math.random() * publicRooms.length)];
        return addMemberToRoom(room!.id, ws, userIp);
      }

      case UserAction.CREATE_PRIVATE: {
        const roomId = createPrivateRoom(data);
        return addMemberToRoom(roomId, ws, userIp);
      }
    }

    ws.on("close", () => {
      removeMemberFromRoom(ws, getUsername(userIp));
    });
  });
});

console.log(`Websocket server started on port ${process.env.PORT}`);

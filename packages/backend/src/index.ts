import { WebSocketServer, WebSocket } from "ws";
import { sendInvalidIpError, sendMessageToUser } from "./actions";
import rooms, {
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
      console.error("Invalid ip");
      return sendInvalidIpError(ws);
    }

    const { action, data }: UserMessage = JSON.parse(msg.toString());
    switch (action) {
      case UserAction.JOIN: {
        if (isRoomNameValid(data) === "ok") {
          addMemberToRoom(data, ws);
        }

        const username = getUsername(userIp);
        sendMessageToAllPeopleInRoom(data, {
          type: ServerAction.USER_JOINED,
          message: "",
          date: new Date(),
          username: username,
        });
        break;
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
      // case UserAction.LEAVE: {
      //   const room = findUserRoom(ws);
      //   if (room) {
      //     const username = getUsername(userIp);
      //     const message = `${username} has left the chat`;
      //     sendMessageToAllPeopleInRoom(room.id, {
      //       type: ServerAction.USER_LEFT,
      //       message,
      //       date: new Date(),
      //       username: username,
      //     });
      //   }
      //   break;
      // }

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
        const publicRooms = [...rooms].filter((room) => !room.isRoomPrivate);
        const randomRoom =
          publicRooms[Math.floor(Math.random() * publicRooms.length)];
        let message: PostMessage;
        if (!randomRoom) {
          message = {
            type: ServerAction.ERROR,
            message: "No public rooms available. Feel free to create your own!",
            username: "System",
            date: new Date(),
          };
        } else {
          message = {
            type: ServerAction.JOIN_RANDOM,
            message: randomRoom.id,
            username: "System",
            date: new Date(),
          };
        }

        ws.send(JSON.stringify(message));
        break;
      }
    }

    ws.on("close", () => {
      const roomId = findUserRoom(ws);
      const username = getUsername(userIp);

      if (!roomId) return;
      sendMessageToAllPeopleInRoom(roomId.id, {
        type: ServerAction.USER_LEFT,
        message: `${username} has left the chat`,
        username,
        date: new Date(),
      });
    });
  });
});

console.log(`Websocket server started on port ${process.env.PORT}`);

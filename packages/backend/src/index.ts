import { WebSocketServer } from "ws";
import { sendInvalidIpError, sendMessageToUser } from "./actions";
import rooms, {
  addMemberToRoom,
  createPrivateRoom,
  findUserRoom,
  getRoom,
  joinPrivateRoom,
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
  type PrivateRoomData,
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
        const room = getRoom(data);
        if (isRoomNameValid(data) === "ok") {
          if (room && room.password) {
            const message: PostMessage = {
              type: ServerAction.REQUIRES_PASSWORD,
              message: "This room is private and requires a password",
              date: new Date(),
              username: "System",
            };

            return ws.send(JSON.stringify(message));
          }
          addMemberToRoom(data, ws, getUsername(userIp));
        }
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
        const publicRooms = [...rooms].filter((room) => !room.password);
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

      case UserAction.CREATE_PRIVATE: {
        return createPrivateRoom(ws, getUsername(userIp), data);
      }

      case UserAction.JOIN_PRIVATE: {
        const roomData: PrivateRoomData = JSON.parse(data) ?? "{}";
        if ("id" in roomData && "password" in roomData) {
          return joinPrivateRoom(
            ws,
            getUsername(userIp),
            roomData.id,
            roomData.password
          );
        }

        const errorMessage: PostMessage = {
          type: ServerAction.ERROR,
          message: "Invalid message structure",
          date: new Date(),
          username: "System",
        };

        ws.send(JSON.stringify(errorMessage));
      }
    }

    ws.on("close", () => {
      removeMemberFromRoom(ws, getUsername(userIp));
    });
  });
});

console.log(`Websocket server started on port ${process.env.PORT}`);

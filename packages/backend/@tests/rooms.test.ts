import {
  test,
  expect,
  mock,
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
  describe,
} from "bun:test";
import {
  addMemberToRoom,
  findUserRoom,
  removeMemberFromRoom,
} from "../src/rooms";
import { v4 as uid } from "uuid";
import { WebSocket } from "ws";
import rooms from "../src/rooms";

function createMockWebSocket(): WebSocket {
  return {
    send: mock(),
    close: mock(),
    readyState: 1,
  } as unknown as WebSocket;
}

describe("Rooms management", () => {
  const defaultUser = createMockWebSocket();
  const roomId = uid();
  beforeEach(() => {
    rooms.clear();
  });

  afterEach(() => {
    rooms.clear();
  });

  describe("Adding members to room", () => {
    test("Room doesn't exist", () => {
      rooms.clear();
      const addMemberToRoomMock = mock(addMemberToRoom);

      addMemberToRoomMock(roomId, defaultUser, "");

      const room = [...rooms].find((room) => room.id === roomId);
      expect(room).toBeTruthy();

      expect(room?.members).toContain(defaultUser);
    });

    test("Room already exists", () => {
      const secondaryUser = createMockWebSocket();
      rooms.add({
        id: roomId,
        members: new Set([secondaryUser]),
      });

      addMemberToRoom(roomId, defaultUser, "");

      const room = [...rooms].find((room) => room.id === roomId);
      expect(room).toBeTruthy();

      expect(room?.members.size).toBe(2);
      expect(room?.members).toContain(defaultUser);
      expect(room?.members).toContain(secondaryUser);
      expect(secondaryUser === defaultUser).toBeFalse();
    });
  });

  describe("Remove user from room", () => {
    test("Room with only one user", () => {
      addMemberToRoom(roomId, defaultUser, "");
      const room = [...rooms].find((room) => room.id === roomId);
      expect(room).toBeTruthy();

      expect(room?.members.has(defaultUser)).toBeTrue();

      removeMemberFromRoom(defaultUser, "");
      expect([...room!.members]).toBeArrayOfSize(0);
    });

    test("ROom with multiple members", () => {
      const secondaryUser = createMockWebSocket();
      addMemberToRoom(roomId, secondaryUser, "1");
      addMemberToRoom(roomId, defaultUser, "2");

      removeMemberFromRoom(defaultUser, "");
      const room = findUserRoom(secondaryUser);
      expect(room?.members.size).toBe(1);
    });
  });

  test("Find user room", () => {
    addMemberToRoom(roomId, defaultUser, "");
    const expectedRoom = [...rooms].find((room) => room.id === roomId);
    expect(expectedRoom).toBeTruthy();
    expect(findUserRoom(defaultUser)).toBe(expectedRoom!);
  });
});

import type { WebSocket } from "ws";
import camelcase from "camelcase";
import { generate } from "random-words";

const usernames = new Map<WebSocket, string>();

const generateRandomUsername = () => {
  const chance = Math.floor(Math.random() * 100);
  if (chance === 1) {
    return generate() as string;
  }

  let wordsCount = 0;

  if (chance < 50) {
    wordsCount = 2;
  } else if (chance < 80) {
    wordsCount = 3;
  } else {
    wordsCount = 4;
  }

  const arr = generate(wordsCount) as string[];
  return camelcase(arr.join(" "));
};

export function getUsername(ws: WebSocket): string {
  if (usernames.has(ws)) {
    return usernames.get(ws)!;
  }

  usernames.set(ws, generateRandomUsername());
  return usernames.get(ws)!;
}

export function regenerateUsername(ws: WebSocket) {
  const newNick = generateRandomUsername();
  usernames.set(ws, newNick);
  return newNick;
}

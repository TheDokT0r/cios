import { UserAction, type UserMessage } from "shared";
import { writable } from "svelte/store";

export const connected = writable(false);
export const ws = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}`);

ws.addEventListener("open", () => {
  connected.set(true);
});

ws.addEventListener("close", () => {
  connected.set(false);
});

export function remindNick() {
  const message: UserMessage = {
    action: UserAction.REMIND_NICK,
    data: "",
  };

  ws.send(JSON.stringify(message));
}

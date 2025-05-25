import { UserAction, type UserMessage } from "shared";
import { writable } from "svelte/store";

export const connected = writable(false);

let backendUrl = window.location.host + "/ws";
if (import.meta.env.MODE === "development") {
  backendUrl = import.meta.env.VITE_BACKEND_URL;
}

export const ws = new WebSocket(`ws://${backendUrl}`);
if (import.meta.env.DEV) {
}

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

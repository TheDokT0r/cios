import { toast } from "@zerodevx/svelte-toast";
import { UserAction, type PostMessage, type UserMessage } from "shared";
import { writable } from "svelte/store";

export const connected = writable(false);

function getBackendUrl(): string {
  const fromLocalStorage = localStorage.getItem("backend url");
  if (fromLocalStorage && fromLocalStorage.length > 1) {
    return fromLocalStorage;
  } else if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  return "wss://" + window.location.host + "/ws"; // Fallback
}

const backendUrl = getBackendUrl();
export const ws = new WebSocket(backendUrl);
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

export function formatIncomingMessage(message: string): PostMessage {
  try {
    const formattedMessage: PostMessage = JSON.parse(message);
    if (!("type" in formattedMessage)) {
      const errorMsg = "Invalid incoming message structure";
      toast.push(errorMsg);
      throw new Error(errorMsg);
    }
    return formattedMessage;
  } catch {
    const errorMessage = "Couldn't parse incoming ws message";
    toast.push(errorMessage);
    throw new Error(errorMessage);
  }
}

export function generateNewUserMessage<T>(
  action: UserAction,
  data: T,
  sendMessage = true
) {
  const message: UserMessage = {
    action,
    data: JSON.stringify(data),
  };

  if (typeof data === "string") {
    message.data = data;
  }

  if (sendMessage) {
    return ws.send(JSON.stringify(message));
  }

  return JSON.stringify(message);
}

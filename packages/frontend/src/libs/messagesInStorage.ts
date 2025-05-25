import type { PostMessage } from "shared";

export function saveLogsToLocalStorage(roomName: string, messages: PostMessage[]) {
    localStorage.setItem(roomName, JSON.stringify(messages));
}

export function loadLogsFromLocalStorage(roomName: string): PostMessage[] {
    const messages = localStorage.getItem(roomName);
    if(!messages) return [];
    return JSON.parse(messages) as PostMessage[];
}
<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { remindNick, ws } from "../libs/socket";
  import {
    ServerAction,
    UserAction,
    type PostMessage,
    type UserMessage,
  } from "shared";
  import Message from "../components/Message.svelte";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import LoadingPage from "../components/LoadingPage.svelte";
  import {
    loadLogsFromLocalStorage,
    saveLogsToLocalStorage,
  } from "../libs/messagesInStorage";
  import ServerMessage from "../components/ServerMessage.svelte";

  let messages: PostMessage[] = $state([]);
  let myNick = $state("");
  let userInput = $state("");
  let roomName = $state("");
  let loading = $state(true);
  let chatLog: HTMLDivElement | null = $state(null);

  onMount(() => {
    loading = true;
    joinRoom();
    loadPrevMessages();
    remindNick();
    document.title = `CiosChat: ${roomName}`;
    loading = false;

    ws.onmessage = (ev) => {
      const message: PostMessage = JSON.parse(ev.data);
      if (!("type" in message)) return;

      if (message.type === ServerAction.NICK) {
        myNick = message.message;
        return;
      }

      if (
        message.type === ServerAction.MESSAGE &&
        message.username === myNick
      ) {
        scrollToBottom();
      }

      messages.push(message);
      saveLogsToLocalStorage(roomName, messages);
    };

    function joinRoom() {
      const urlVars = document.URL.toLocaleLowerCase().split("/channel/c=");
      roomName = urlVars[urlVars.length - 1];
      const joinRoomMessage: UserMessage = {
        action: UserAction.JOIN,
        data: roomName,
      };

      ws.send(JSON.stringify(joinRoomMessage));
    }

    function loadPrevMessages() {
      const messagesCopy = { ...messages };
      messages = JSON.parse(localStorage.getItem(roomName) ?? "[]");
      messages.concat(messagesCopy);
      scrollToBottom();
    }
  });

  onDestroy(() => {
    const leaveMessage: UserMessage = {
      action: UserAction.LEAVE,
      data: "",
    };

    ws.send(JSON.stringify(leaveMessage));
    saveLogsToLocalStorage(roomName, messages);
  });

  function onSendClick(e: SubmitEvent) {
    e.preventDefault();
    if (userInput.length === 0) return;

    const message: UserMessage = {
      action: UserAction.MESSAGE,
      data: userInput,
    };

    ws.send(JSON.stringify(message));
    userInput = "";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendClick(e as unknown as SubmitEvent); // Just reuse your existing send logic
    }
  }

  function scrollToBottom() {
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }
</script>

{#if loading}
  <LoadingPage />
{:else}
  <div class="chat-container">
    <div class="chat-log" bind:this={chatLog}>
      {#each messages as message}
        {#if message.type === ServerAction.MESSAGE}
          <Message {message} username={myNick} />
        {:else}
          <ServerMessage {message} />
        {/if}
      {/each}
    </div>

    <form class="chat-input" onsubmit={onSendClick}>
      <textarea
        onkeydown={handleKeyDown}
        bind:value={userInput}
        rows="2"
        placeholder="Type your message..."
      ></textarea>
      <button type="submit">
        <SendHorizontalIcon />
      </button>
    </form>
  </div>
{/if}

<style lang="scss">
  .chat-container {
    position: fixed;
    top: 64px; /* height of your TopAppBar */
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
    box-sizing: border-box;
    background-color: #121212;
  }

  .chat-log {
    flex: 1;
    overflow-y: auto;
    padding: 1em;
    border: 1px solid white;
    border-radius: 10px;
    margin-bottom: 0.5em;
  }

  .chat-input {
    display: flex;
    gap: 0.5em;
    align-items: center;

    textarea {
      flex: 1;
      resize: none;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5em;
    }
  }
</style>

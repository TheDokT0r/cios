<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { remindNick, ws } from "../libs/socket";
  import {
    ServerAction,
    UserAction,
    type PostMessage,
    type UserMessage,
  } from "shared";
  import Message from "../components/Message.svelte";

  let messages: PostMessage[] = $state([]);
  let myNick = $state("");
  let userInput = $state("");

  $effect(() => console.log(messages));

  function joinRoom() {
    const urlVars = document.URL.toLocaleLowerCase().split("/channel/c=");
    const joinRoomMessage: UserMessage = {
      action: UserAction.JOIN,
      data: urlVars[urlVars.length - 1],
    };

    ws.send(JSON.stringify(joinRoomMessage));
  }

  onMount(() => {
    joinRoom();
    remindNick();

    ws.onmessage = (ev) => {
      const message: PostMessage = JSON.parse(ev.data);
      if (!("type" in message)) return;

      switch (message.type) {
        case ServerAction.MESSAGE: {
          messages.push(message);
          break;
        }
        case ServerAction.NICK: {
          myNick = message.message;
          break;
        }
      }
    };
  });

  onDestroy(() => {
    const leaveMessage: UserMessage = {
      action: UserAction.LEAVE,
      data: "",
    };

    ws.send(JSON.stringify(leaveMessage));
  });

  function onSendClick(e: MouseEvent) {
    e.preventDefault();
    if (userInput.length === 0) return;

    const message: UserMessage = {
      action: UserAction.MESSAGE,
      data: userInput,
    };

    ws.send(JSON.stringify(message));
    userInput = "";
  }
</script>

{#if myNick === ""}
  <div>Waiting for nick...</div>
{:else}
  <div class="chat-container">
    <div id="chat-log" class="chat-log">
      {#each messages as message}
        <Message {message} username={myNick} />
      {/each}
    </div>

    <form class="chat-input">
      <textarea
        bind:value={userInput}
        rows="2"
        placeholder="Type your message..."
      ></textarea>
      <button onclick={onSendClick} type="submit">Send</button>
    </form>
  </div>
{/if}

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
  }

  .chat-log {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background: #f7f7f7;
  }

  .chat-message {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: white;
    border-radius: 6px;
    max-width: 80%;
  }

  .chat-input {
    display: flex;
    padding: 0.5rem;
    border-top: 1px solid #ccc;
    background: white;
  }

  textarea {
    flex: 1;
    resize: none;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
  }

  button {
    margin-left: 0.5rem;
    padding: 0.5rem 1rem;
  }
</style>

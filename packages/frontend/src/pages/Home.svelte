<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import {
    isRoomNameValid,
    ServerAction,
    UserAction,
    type PostMessage,
    type UserMessage,
  } from "shared";
  import { ws } from "../libs/socket";

  let roomId = $state("");
  let username = $state("");
  let loading = $state(false);

  onMount(() => {
    const message: UserMessage = {
      action: UserAction.REMIND_NICK,
      data: "",
    };

    ws.send(JSON.stringify(message));
  });

  ws.onmessage = (ev) => {
    const data = JSON.parse(ev.data) as PostMessage;
    if (data.type === ServerAction.NICK) {
      loading = true;
      username = data.message;
      loading = false;
    }
  };

  function onEnterClick(e?: MouseEvent) {
    if(e) {
      e.preventDefault();
    }
    const valid = isRoomNameValid(roomId);

    if (valid === "empty") {
      return toast.push("Please enter a room ID");
    } else if (valid === "white spaces") {
      return toast.push("Room ID can't have any white spaces in it");
    }

    const link = document.createElement("a");
    link.href = `/channel/c=${roomId}`;
    link.click();
  }

  function onRegenerateUsernameClick(e: MouseEvent) {
    e.preventDefault();
    const message: UserMessage = {
      action: UserAction.RENAME,
      data: "",
    };
    ws.send(JSON.stringify(message));
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else}
  <div>
    <h1>Welcome to chatroom</h1>
    <form onsubmit={() => onEnterClick()}>
      <input bind:value={roomId} type="text" placeholder="Room ID" />
      <button>Enter</button>
    </form>
    <div>
      <p>Your username is: {username}</p>
      <button onclick={onRegenerateUsernameClick}>Regenerate</button>
    </div>
  </div>
{/if}

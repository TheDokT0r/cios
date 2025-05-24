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
  import "../styles/app.scss";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import RepeatIcon from "@lucide/svelte/icons/repeat-2";

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

  function onEnterClick(e: SubmitEvent) {
    e.preventDefault();
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
  <div class="home-container">
    <h1>Welcome to chatroom</h1>
    <form onsubmit={(e) => onEnterClick(e)}>
      <input bind:value={roomId} type="text" placeholder="Room ID" />
      <button>
        <SendHorizontalIcon />
      </button>
    </form>
    <div class="username-container">
      <p>Your username is: <span>{username}</span></p>
      <button onclick={onRegenerateUsernameClick}>
        <RepeatIcon scale="5rem" />
      </button>
    </div>
  </div>
{/if}

<style lang="scss">
  .home-container {
    display: flex;
    flex-direction: column;
    justify-content: center; /* Horizontal */
    align-items: center; /* Vertical */
    height: 100vh;

    h1 {
      font-size: 3rem;
      text-align: center;
    }

    form {
      display: flex;
      align-items: center;
    }

    input {
      margin-right: 0.5rem;
    }

    .username-container {
      position: fixed;
      right: 0.5rem;
      bottom: 0.5rem;
      display: flex;
      align-items: center;

      button {
        margin-left: 0.5rem;
      }

      span {
        color: rgb(255, 107, 107);
      }
    }
  }
</style>

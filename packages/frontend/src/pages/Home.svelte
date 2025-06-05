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
  import DicesIcon from '@lucide/svelte/icons/dices';

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
    switch(data.type) {
      case ServerAction.ERROR: {
        toast.push(data.message);
      }

      case ServerAction.NICK: {
        loading = true;
        username = data.message;
        loading = false;
        break;
      }

      case ServerAction.USER_JOINED: {
        const link = document.createElement("a");
        link.href = `/channel/c=${data.message}`;
        link.click();
      }
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

  function joinRandomRoom(e: MouseEvent) {
    e.preventDefault();
    const message: UserMessage = {
      action: UserAction.JOIN_RANDOM,
      data: ""
    };
    ws.send(JSON.stringify(message));
  }
</script>

{#if loading}
  <div>Loading...</div>
{:else}
  <div class="home-container">
    <h1>Welcome to CiosChat</h1>
    <h2>A place where you can explore random rooms with random people</h2>
    <h3>Just write a random room name and see who waits for you on the other side!</h3>
    <form onsubmit={(e) => onEnterClick(e)}>
      <input bind:value={roomId} type="text" placeholder="Room ID" />
      <button>
        <SendHorizontalIcon />
      </button>
    </form>
    <div class="extra-options-section">
        <button onclick={joinRandomRoom}>
            <DicesIcon />
        </button>
    </div>

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

    h1, h2, h3 {
      margin-top: -1rem;
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

  .extra-options-section {
      margin-top: 1rem;
      display: flex;
  }
</style>

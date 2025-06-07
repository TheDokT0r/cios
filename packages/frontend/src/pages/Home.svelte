<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import {
    ErrorCodes,
    isRoomNameValid,
    ServerAction,
    UserAction,
    type PostMessage,
    type UserMessage,
  } from "shared";
  import {
    formatIncomingMessage,
    generateNewUserMessage,
    ws,
  } from "../libs/socket";
  import "../styles/app.scss";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import DicesIcon from "@lucide/svelte/icons/dices";
  import LockIcon from "@lucide/svelte/icons/lock";
  import redirectToURL from "../libs/redirect";
  import UsernameGenerator from "../components/UsernameGenerator.svelte";
  import errorHandler from "../libs/errorsHandler";

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

  ws.addEventListener("message", (ev) => {
    const data = formatIncomingMessage(ev.data);
    switch (data.type) {
      case ServerAction.ERROR: {
        return errorHandler(data.message as ErrorCodes);
      }

      case ServerAction.NICK: {
        username = data.message;
        break;
      }
    }
  });

  function onEnterClick(e: SubmitEvent) {
    e.preventDefault();
    const valid = isRoomNameValid(roomId);

    if (valid === "empty") {
      return toast.push("Please enter a room ID");
    } else if (valid === "white spaces") {
      return toast.push("Room ID can't have any white spaces in it");
    }

    redirectToURL(`/channel/c=${roomId}`);
  }

  function joinRandomRoom(e: MouseEvent) {
    e.preventDefault();
    const message: UserMessage = {
      action: UserAction.JOIN_RANDOM,
      data: "",
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
    <h3>
      Just write a random room name and see who waits for you on the other side!
    </h3>
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

      <button onclick={() => redirectToURL("/create-private")}>
        <LockIcon />
      </button>
    </div>

    <UsernameGenerator {username} />
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

    h1,
    h2,
    h3 {
      margin-top: -1rem;
    }

    form {
      display: flex;
      align-items: center;
    }

    input {
      margin-right: 0.5rem;
    }
  }

  .extra-options-section {
    margin-top: 1rem;
    display: flex;

    > * + * {
      margin-left: 2rem; // or whatever margin you want
    }
  }
</style>

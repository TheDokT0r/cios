<script lang="ts">
  import RepeatIcon from "@lucide/svelte/icons/repeat-2";
  import { formatIncomingMessage, ws } from "../libs/socket";
  import {
    type PostMessage,
    type UserMessage,
    ServerAction,
    UserAction,
  } from "shared";

  interface Props {
    username: string;
  }

  let { username }: Props = $props();

  function onRegenerateUsernameClick(e: MouseEvent) {
    e.preventDefault();
    const message: UserMessage = {
      action: UserAction.RENAME,
      data: "",
    };
    ws.send(JSON.stringify(message));
  }

  ws.addEventListener("message", (ev) => {
    const { type, message } = formatIncomingMessage(ev.data);
    if (type === ServerAction.NICK) {
      username = message;
    }
  });
</script>

<div class="username-container">
  <p>Your username is: <span>{username}</span></p>
  <button onclick={onRegenerateUsernameClick}>
    <RepeatIcon scale="5rem" />
  </button>
</div>

<style lang="scss">
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
</style>

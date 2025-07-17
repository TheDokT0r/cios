<script lang="ts">
  import { ServerAction, type PostMessage } from "shared";

  interface Props {
    message: PostMessage;
  }

  const { message }: Props = $props();
</script>

<div class="server-message-container">
  {#if message.type === ServerAction.USER_JOINED}
    <p class="system-text">
      <span class="username">{message.username}</span> has joined the chat
    </p>
  {:else if message.type === ServerAction.USER_LEFT}
    <p class="system-text">
      <span class="username">{message.username}</span> has left the chat
    </p>
  {:else}
    <p class="system-text">{message.message}</p>
  {/if}
</div>

<style lang="scss">
  @use "../styles/vars.scss";

  .server-message-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.02);
    text-align: center;
    font-size: 0.9rem;
    color: #aaa;
  }

  .system-text {
    margin: 0;
    font-style: italic;
  }

  .username {
    color: #ce3e3e;
    font-weight: 500;
  }
</style>

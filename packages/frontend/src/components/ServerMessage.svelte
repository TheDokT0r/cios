<script lang="ts">
  import { ServerAction, type PostMessage } from "shared";
  // import { format } from "date-fns";

  interface Props {
    message: PostMessage;
  }

  const { message }: Props = $props();
</script>

<div class="message-container">
  {#if message.type === ServerAction.USER_JOINED}
    <p>
      <span class="username">{message.username}</span> Has joined the chat
    </p>
  {:else if message.type === ServerAction.USER_LEFT}
    <p>
      <span class="username">{message.username}</span> Has left the chat
    </p>
  {:else}
    <p class="message">{message.message}</p>
  {/if}

  <!-- <div class="timestamp"> -->
  <!-- <p>{format(message.date, "dd/MM/yyyy hh:mm")}</p> -->
  <!-- </div> -->
</div>

<style lang="scss">
  @use "../styles/vars.scss";

  .message-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    padding: 0.5rem;
    text-align: center;

    &:hover {
      background-color: adjust-color(
        $color: vars.$back-color,
        $lightness: 1%
      ) !important;
    }
  }

  .message {
    margin-left: 0.5rem;
    flex: 1;
  }

  .username {
    color: #ce3e3e;
  }
</style>

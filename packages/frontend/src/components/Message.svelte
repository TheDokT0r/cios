<script lang="ts">
  import type { PostMessage } from "shared";
  import { format } from "date-fns";

  interface Props {
    message: PostMessage;
    username?: string;
  }

  const { message, username }: Props = $props();
</script>

<div class="message-container">
  <p class="message">
    <b
      style={`color: ${username === message.username ? "rgb(255, 107, 107)" : "white"}`}
    >
      {message.username}:
    </b>

    <span style="white-space: pre-wrap;">{message.message}</span>
  </p>

  <p>{format(message.date, "dd/MM/yyyy hh:mm")}</p>
</div>

<style lang="scss">
  @use "../styles/vars.scss";

  .message-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border: 1px solid white;
    border-radius: 6px;
    padding: 0.5rem;

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
</style>

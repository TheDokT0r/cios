<script lang="ts">
  import type { PostMessage } from "shared";
  import { format } from "date-fns";

  interface Props {
    message: PostMessage;
    username?: string;
  }

  const { message, username }: Props = $props();

  function getUsernameColor(
    currentUsername: string | undefined,
    targetUsername: string
  ): string {
    if (currentUsername === targetUsername) return "rgb(255, 107, 107)";

    let hash = 0;
    for (let i = 0; i < targetUsername.length; i++) {
      hash = targetUsername.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 60%, 65%)`;
  }
</script>

<div class="message-container">
  <div class="message-content">
    <img
      class="avatar"
      src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${message.username}`}
      alt={`${message.username}_pfp`}
    />
    <div class="text-block">
      <b
        style={`color: ${getUsernameColor(username, message.username)}`}
      >
        {message.username}:
      </b>
      <br />
      <span class="text-message">{message.message}</span>
    </div>
  </div>

  <p class="timestamp">{format(message.date, "dd/MM/yyyy hh:mm")}</p>
</div>

<style lang="scss">
  @use "../styles/vars.scss";

  .message-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 6px;
    padding: 0.5rem;
  }

  .message-content {
    display: flex;
    align-items: flex-start;
    flex: 1;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .text-block {
    margin-left: 0.75rem;
    flex: 1;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    transition:
      background-color 0.2s ease,
      box-shadow 0.2s ease;

    // Doesn't really work atm so it's disabled for now
    // &:hover {
    //   background-color: rgba(255, 255, 255, 0.04);
    //   box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
    // }
  }

  .text-message {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.5rem;
    border-radius: 4px;
    margin-top: 0.25rem;
    white-space: pre-wrap;
    color: #f1f1f1;
  }

  .timestamp {
    font-size: 0.75rem;
    color: #888;
    margin-left: 1rem;
    white-space: nowrap;
  }
</style>

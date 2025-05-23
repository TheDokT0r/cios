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
    <b style={`color: ${username === message.username ? "red" : "black"}`}>
      {message.username}:
    </b>

    {message.message}
  </p>

  <div class="timestamp">
    <p>{format(message.date, "dd/MM/yyyy hh:mm")}</p>
  </div>
</div>

<style lang="scss">
.message-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  border-radius: 6px;
  padding: 0.5rem;
}

.message {
  margin-left: 0.5rem;
  flex: 1;
}

.timestamp {
  margin-left: auto;
  font-size: 0.875rem;
  color: #666;
}

</style>

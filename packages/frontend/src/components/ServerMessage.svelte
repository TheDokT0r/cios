<script lang="ts">
  import type { PostMessage } from "shared";
  import { format } from "date-fns";

  interface Props {
    message: PostMessage;
  }

  const { message }: Props = $props();
</script>

<div class="message-container">
  <p class="message">
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
    border-radius: 6px;
    padding: 0.5rem;
    text-align: center;
  }

  .message {
    margin-left: 0.5rem;
    flex: 1;
  }

  .timestamp {
    margin-left: auto;
    font-size: 0.875rem;
    color: #c7bcbc;
  }
</style>

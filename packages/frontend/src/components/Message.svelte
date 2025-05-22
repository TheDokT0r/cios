<script lang="ts">
  import type { PostMessage } from "shared";

    interface Props {
        message: PostMessage;
    }

    const {message}: Props = $props();
</script>

<div>
  <p class="username">{message.username}:</p>
  <p class="message">{message.message}</p>
</div>

<style lang="scss">
  div {
    display: flex;
  }

  p {
    margin-right: .5rem;
  }
</style>
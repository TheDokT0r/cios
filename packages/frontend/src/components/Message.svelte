<script lang="ts">
  import type { PostMessage } from "shared";

    interface Props {
        message: PostMessage;
    }

    const {message}: Props = $props();
</script>
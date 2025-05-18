<script lang="ts">
  import { onMount } from "svelte";
  import Home from "./pages/Home.svelte";
  import Chatroom from "./pages/Chatroom.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { connected } from "./libs/socket";

  let isConnected = $state(false);
  connected.subscribe((value) => {
    isConnected = value;
  });

  function getRoomId() {
    const urlParams = document.URL.toLowerCase().split("/channel/c=");
    if (urlParams.length <= 1) {
      return false;
    }

    return urlParams[urlParams.length - 1];
  }

  onMount(() => {});
</script>

<main>
  <SvelteToast />

  {#if isConnected}
    {#if getRoomId() === false}
      <Home />
    {:else}
      <Chatroom />
    {/if}
  {:else}
    <main>
      <h1>Establishing connection to server...</h1>
    </main>
  {/if}
</main>

<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "@fontsource/rubik";
  import TopAppBar from "./components/TopAppBar.svelte";
  import LoadingPage from "./components/LoadingPage.svelte";
  import { connected } from "./libs/socket";
  import { type Component } from "svelte";

  let isConnected = false;
  connected.subscribe((value) => {
    isConnected = value;
  });

  let currentPage: Component | null = null;

  async function loadPage() {
    const url = window.location.pathname.toLowerCase();
    if (url.includes("/channel/c=")) {
      const mod = await import("./pages/Chatroom.svelte");
      currentPage = mod.default;
    } else if (url.includes("/create-private")) {
      const mod = await import("./pages/PrivateRoomCreationPage.svelte");
      currentPage = mod.default;
    } else {
      const mod = await import("./pages/Home.svelte");
      currentPage = mod.default;
    }
  }

  onMount(loadPage);
</script>

<main>
  <SvelteToast />
  <TopAppBar />

  {#if isConnected}
    {#if currentPage}
      <svelte:component this={currentPage} />
    {:else}
      <LoadingPage />
    {/if}
  {:else}
    <LoadingPage />
  {/if}
</main>

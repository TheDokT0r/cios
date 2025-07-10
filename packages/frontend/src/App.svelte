<script lang="ts">
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "@fontsource/rubik";
  import TopAppBar from "./components/TopAppBar.svelte";
  import { connected } from "./libs/socket";
  import LoadingPage from "./components/LoadingPage.svelte";
  import { type Component } from "svelte";

  let isConnected = false;
  connected.subscribe((value) => {
    isConnected = value;
  });

  let currentPage: Component | null = null;

  async function loadPage() {
    const url = window.location.pathname.toLowerCase();
    if (url === "/" || url === "") {
      const mod = await import("./pages/Home.svelte");
      currentPage = mod.default;
    } else if (url.includes("/channel/c=")) {
      const mod = await import("./pages/Chatroom.svelte");
      currentPage = mod.default;
    } else if (url.includes("/create-private")) {
      const mod = await import("./pages/PrivateRoomCreationPage.svelte");
      currentPage = mod.default;
    } else if (url.includes("/settings")) {
      const mod = await import("./pages/SettingsPage.svelte");
      currentPage = mod.default;
    } else {
      const mod = await import("./pages/PageNotFound.svelte");
      currentPage = mod.default;
    }
  }

  function setupRouting() {
    loadPage();

    window.addEventListener("popstate", loadPage);
  }

  onMount(setupRouting);
</script>


<main>
  {#if !isConnected}
    <LoadingPage />
  {:else}
    <SvelteToast />
    <TopAppBar />

    <svelte:component this={currentPage} />
  {/if}
</main>

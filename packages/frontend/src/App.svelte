<script>
  import { onMount } from "svelte";
  import Home from "./pages/Home.svelte";
  import Chatroom from "./pages/Chatroom.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { connected } from "./libs/socket";
  import "@fontsource/rubik";
  import TopAppBar from "./components/TopAppBar.svelte";
  import LoadingPage from "./components/LoadingPage.svelte";
  import PrivateRoomCreationPage from "./pages/PrivateRoomCreationPage.svelte";

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

  const isCreatingPrivateRoom = () =>
    getRoomId() === false &&
    document.URL.toLowerCase().includes("/create-private");

</script>

<main>
  <SvelteToast />
  <TopAppBar />

  {#if isConnected}
    {#if getRoomId() !== false}
      <Chatroom />
    {:else if isCreatingPrivateRoom()}
      <PrivateRoomCreationPage />
    {:else}
      <Home />
    {/if}
  {:else}
    <LoadingPage />
  {/if}
</main>

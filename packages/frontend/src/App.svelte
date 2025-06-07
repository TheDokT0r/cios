<script lang="ts">
  import { onMount } from "svelte";
  import Home from "./pages/Home.svelte";
  import Chatroom from "./pages/Chatroom.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { connected, formatIncomingMessage, ws } from "./libs/socket";
  import "@fontsource/rubik";
  import TopAppBar from "./components/TopAppBar.svelte";
  import LoadingPage from "./components/LoadingPage.svelte";
  import PrivateRoomCreationPage from "./pages/PrivateRoomCreationPage.svelte";
  import { ServerAction, ErrorCodes } from "shared";
  import ServerMessage from "./components/ServerMessage.svelte";
  import errorHandler from "./libs/errorsHandler";

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

  ws.addEventListener("message", (ev) => {
    const { type, message } = formatIncomingMessage(ev.data);
    if (type === ServerAction.ERROR || type === ServerAction.ROOM_ERROR) {
      errorHandler(message as ErrorCodes);
    }
  });
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

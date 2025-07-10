<script>
  import GitHubIcon from "@lucide/svelte/icons/github";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import { toast } from "@zerodevx/svelte-toast";
  import redirectToURL from "../libs/redirect";
  import AppIcon from "../assets/cios.svg";
  import SettingsIcon from "@lucide/svelte/icons/settings";

  function getRoomName() {
    const urlParams = document.URL.toLowerCase().split("/channel/c=");
    if (urlParams.length <= 1) {
      return false;
    }

    return urlParams[urlParams.length - 1];
  }

  function copyRoomNameToClipboard() {
    const roomName = getRoomName();
    if (roomName) {
      navigator.clipboard.writeText(roomName);
      toast.push("Copied room name to clipboard");
    }
  }
</script>

<div class="top-app-bar">
  <button class="top-app-bar-title" onclick={() => redirectToURL("/")}>
    <img src={AppIcon} alt="cios-img" />
    CiosChat
  </button>
  {#if getRoomName()}
    <div class="room-name-container">
      <h3>Room ID: <span>{getRoomName()}</span></h3>
      <button onclick={copyRoomNameToClipboard}>
        <CopyIcon />
      </button>
    </div>
  {/if}
  <div class="spacer"></div>
  <button class="icon-button" onclick={() => redirectToURL("/settings")}>
    <SettingsIcon />
  </button>
  <button
    class="icon-button"
    onclick={() =>
      redirectToURL("https://github.com/TheDokT0r/chatroom", {
        pageReload: true,
      })}
  >
    <GitHubIcon />
  </button>
</div>

<style style="scss">
  .top-app-bar {
    display: flex;
    align-items: center;
    height: 64px;
    background-color: #6200ee;
    color: white;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .room-name-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    margin-left: 2rem;

    span {
      color: #ce3e3e;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5em;
      margin-left: 1rem;
      transform: scale(0.8);
    }
  }

  .top-app-bar-title {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 500;
    user-select: none;
    text-decoration: none;
    color: inherit;

    img {
      height: 50px;
      margin-right: 5px;
    }

    &:hover {
      background-color: lighten(white, 10%);
      text-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    }
  }

  .spacer {
    flex: 1;
  }

  .icon-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    margin-left: 16px;
  }
</style>

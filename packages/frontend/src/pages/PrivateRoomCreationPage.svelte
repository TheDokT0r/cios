<script lang="ts">
  import UsernameGenerator from "../components/UsernameGenerator.svelte";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import { formatIncomingMessage, generateNewUserMessage, ws } from "../libs/socket";
  import { ServerAction, UserAction } from "shared";
  import redirectToURL from "../libs/redirect";
  let username = $state("");
  let password = $state("");

  function createPrivateRoom(e: SubmitEvent) {
    e.preventDefault();
    generateNewUserMessage(UserAction.CREATE_PRIVATE, password);
  }

  ws.addEventListener("message", (ev) => {
    const {message, type} = formatIncomingMessage(ev.data);
    if(type === ServerAction.USER_JOINED) {
      redirectToURL(`/channel/c=${message}`);
      localStorage.setItem(message + " password", password); // Adds room password to local storage
    }
  });
</script>

<div>
  <h1>Create a Private Room</h1>
  <form onsubmit={createPrivateRoom}>
    <input type="password" placeholder="Room Password" bind:value={password} />
    <button><SendHorizontalIcon /></button>
  </form>

  <UsernameGenerator {username} />
</div>

<style lang="scss">
  div {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    > * + * {
      margin: 4rem; // or whatever margin you want
    }
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 75%;
    min-width: 25%;

    input {
      text-align: center;
    }
  }
</style>

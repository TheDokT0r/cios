<script lang="ts">
  import UsernameGenerator from "../components/UsernameGenerator.svelte";
  import SendHorizontalIcon from "@lucide/svelte/icons/send-horizontal";
  import { ws } from "../libs/socket";
  import { UserAction, type UserMessage } from "shared";
  let username = $state("");
  let password = $state("");

  function createPrivateRoom(e: SubmitEvent) {
    e.preventDefault();

    const message: UserMessage = {
      action: UserAction.CREATE_PRIVATE,
      data: password,
    };

    ws.send(JSON.stringify(message));
  }
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

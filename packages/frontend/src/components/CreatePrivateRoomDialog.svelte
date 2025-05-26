<script lang="ts">
  import SendHorizonalIcon from "@lucide/svelte/icons/send-horizontal";
  import { UserAction, type UserMessage } from "shared";
  import { ws } from "../libs/socket";

  interface Props {
    open: boolean;
  }

  const { open }: Props = $props();

  let password = $state("");

  function createPrivateRoom(e: MouseEvent) {
    e.preventDefault();

    const message: UserMessage = {
      action: UserAction.CREATE_PRIVATE,
      data: password,
    };

    ws.send(JSON.stringify(message));
  }

  $effect(() => {
    if (!open) {
      password = "";
    }
  });
</script>

{#if open}
  <dialog open>
    <div class="dialog-content">
      <h1 class="title">Please write room password</h1>
      <div class="password-form">
        <input
          placeholder="password"
          type="password"
          bind:value={password}
          class="input"
        />
        <button class="send-button" onclick={createPrivateRoom}>
          <SendHorizonalIcon />
        </button>
      </div>
    </div>
  </dialog>
{/if}

<style lang="scss">
dialog {
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 10;
  padding: 2rem;
  background: #222;
  color: white;
  border: 2px solid white;
  border-radius: 10px;
  display: grid;
  place-items: center;
  max-width: 400px;

  &::backdrop {
    backdrop-filter: blur(6px);
    background: rgba(0, 0, 0, 0.4);
  }

  .dialog-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
    text-align: center;
  }

  .password-form {
    display: flex;
    align-items: center;

    .input {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      background: #333;
      color: white;
    }

    .send-button {
      margin-left: 10px;
      padding: 0.5rem;
      background: #444;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: background 0.2s;

      &:hover {
        background: #555;
      }
    }
  }
}
</style>

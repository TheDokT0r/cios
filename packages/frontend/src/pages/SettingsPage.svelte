<script lang="ts">
  import { Trash2Icon } from "@lucide/svelte";
  import { toast } from "@zerodevx/svelte-toast";

  let backendUrl = $state("");

  function clearCache() {
    localStorage.clear();
    toast.push("Cache Cleared!");
  }

  function changeBackendUrl(e: SubmitEvent) {
    e.preventDefault();

    // Clearing the localstorage to prevent chats and passwords from one backend to get conflicted with another
    localStorage.clear();
    localStorage.setItem("backend url", backendUrl);
    if (backendUrl) {
      toast.push("Backend URL changed");
    } else {
      toast.push("Backend URL cleared");
    }
  }
</script>

<div class="settings-page">
  <div>
    <span>Clear App Cache:</span>
    <button onclick={clearCache}>
      <Trash2Icon />
    </button>
  </div>

  <div>
    <span>Change Backend URL:</span>
    <form onsubmit={changeBackendUrl}>
      <input
        type="url"
        placeholder="wss://localhost:3000"
        bind:value={backendUrl}
      />
      <button>Submit</button>
    </form>
  </div>
</div>

<style lang="scss">
  .settings-page {
    display: grid;
    place-items: center;
    user-select: none;

    div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem;

      span {
        font-size: 1.5rem;
        margin-right: 2rem;
      }

      form {
        display: flex;

        button {
          border-radius: 15px;
          margin-left: 0.5rem;
        }

        input {
          text-align: center;
        }
      }
    }
  }
</style>

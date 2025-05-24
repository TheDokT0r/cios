<script>
  import GitHubIcon from "@lucide/svelte/icons/github";

  function onGitHubButtonClick() {
    const a = document.createElement("a");
    a.href = "https://github.com/TheDokT0r/chatroom";
    a.click();
  }
</script>

<div class="top-app-bar">
  <div class="top-app-bar-title">Chatroom</div>
  <div class="spacer"></div>
  <button class="icon-button" onclick={onGitHubButtonClick}>
    <GitHubIcon />
  </button>
</div>

<style>
  .top-app-bar {
    display: flex;
    align-items: center;
    height: 64px;
    background-color: #6200ee;
    color: white;
    padding: 0 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .top-app-bar-title {
    font-size: 1.25rem;
    font-weight: 500;
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

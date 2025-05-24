<script>
  import { Clock } from "svelte-loading-spinners";
</script>

<div>
  <Clock color="white" size="20" unit="rem" />
  <p>Establishing communication with the server...</p>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full viewport height */
    text-align: center;
  }

  p {
    font-size: 2rem;
    user-select: none;
    margin-top: 2rem;
  }
</style>

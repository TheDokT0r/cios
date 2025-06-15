<script>
    import HouseIcon from "@lucide/svelte/icons/house";
    import redirectToURL from "../libs/redirect";
</script>

<div>
    <h1>Page Not Found!</h1>
    <p>Oops, seems like the page you're trying to retrive doesn't exist!</p>

    <button onclick={() => redirectToURL("/")}>
        <HouseIcon />
    </button>
</div>

<style>
    div {
        display: grid;
        place-items: center;
    }

    h1 {
        font-size: 4vh;
    }

    p {
        font-size: 2vh;
    }

    button {
        margin-top: 2vh;
        scale: 1.5;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import {
        formatIncomingMessage,
        generateNewUserMessage,
        ws,
    } from "../libs/socket";
    import { ErrorCodes, ServerAction, UserAction } from "shared";

    interface Props {
        roomId: string;
    }

    const { roomId }: Props = $props();

    let roomRequiresPassword = $state(false);
    let incorrectPassword = $state(true);
    let alreadyInRoom = $state(false);
    let password = $state("");

    function showDialog() {
        return roomRequiresPassword && incorrectPassword && !alreadyInRoom;
    }

    onMount(() => {
        generateNewUserMessage(UserAction.IS_IN_ROOM, roomId);

        ws.addEventListener("message", (ev) => {
            const { message, type } = formatIncomingMessage(ev.data);

            if (type === ServerAction.ERROR && message === ErrorCodes.REQUIRES_PASSWORD) {
                roomRequiresPassword = true;

                const savedPassword = localStorage.getItem(roomId + " password");
                if (savedPassword) {
                    generateNewUserMessage(
                        UserAction.JOIN_PRIVATE,
                        JSON.stringify({ roomId, password: savedPassword }),
                    );
                }
            } else if (type === ServerAction.CORRECT_PASSWORD) {
                incorrectPassword = false;
            } else if (type === ServerAction.IS_IN_ROOM && message === "yes") {
                alreadyInRoom = true;
            }
        });
    });

    function onPasswordSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (password) {
            localStorage.setItem(roomId + " password", password);
            generateNewUserMessage(
                UserAction.JOIN_PRIVATE,
                JSON.stringify({ roomId, password }),
            );
        }
    }
</script>

<dialog style="display: {showDialog() ? 'flex' : 'none'}">
    <h1>Room Requires Password</h1>
    <form onsubmit={onPasswordSubmit}>
        <input
            type="password"
            placeholder="Room Password"
            bind:value={password}
        />
        <button type="submit">Submit</button>
    </form>
</dialog>

<style lang="scss">
    dialog {
        width: 50vw;
        height: 50vh;
        border: 2px solid white;
        display: flex; // default
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        background: #222;
    }

    form {
        display: grid;
        place-items: center;
    }

    input {
        padding: 0.5rem;
        font-size: 1rem;
    }

    button {
        border-radius: 10px;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
    }
</style>

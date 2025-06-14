<script lang="ts">
    interface Props {
        roomId: string;
    }

    const { roomId }: Props = $props();

    import { onMount } from "svelte";
    import {
        formatIncomingMessage,
        generateNewUserMessage,
        ws,
    } from "../libs/socket";
    import { ErrorCodes, ServerAction, UserAction } from "shared";

    let roomRequiresPassword = $state(false);
    let incorrectPassword = $state(true);
    let password = $state("");

    onMount(() => {
        ws.addEventListener("message", (ev) => {
            const { message, type } = formatIncomingMessage(ev.data);
            if (
                type === ServerAction.ERROR &&
                message === ErrorCodes.REQUIRES_PASSWORD
            ) {
                roomRequiresPassword = true;
                const savedPassword = localStorage.getItem(
                    roomId + " password",
                );
                if (savedPassword) {
                    return generateNewUserMessage(
                        UserAction.JOIN_PRIVATE,
                        JSON.stringify({ roomId, password: savedPassword }),
                    );
                }
            } else if (type === ServerAction.CORRECT_PASSWORD) {
                incorrectPassword = false;
            }
        });
    });
    function onPasswordSubmit(e: SubmitEvent) {
        e.preventDefault();
        if (password) {
            localStorage.setItem(roomId + " password", password);
            return generateNewUserMessage(
                UserAction.JOIN_PRIVATE,
                JSON.stringify({ roomId, password }),
            );
        }
    }
</script>

<dialog open={roomRequiresPassword && incorrectPassword}>
    <h1>Room Requires Password</h1>
    <form onsubmit={onPasswordSubmit}>
        <input
            type="password"
            placeholder="Room Password"
            bind:value={password}
        />
        <button>Submit</button>
    </form>
</dialog>

<style lang="scss">
    dialog {
        width: 50vw;
        height: 50vh;
    }
</style>

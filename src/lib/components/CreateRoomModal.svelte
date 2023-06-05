<script lang="ts">
	import { goto } from '$app/navigation';
	import { socket } from '$lib/socket';
	import { modalVisible } from '$lib/store';
	import type { TSocketResponse } from '$lib/types';
	import { generateSlug } from 'random-word-slugs';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Modal from './Modal.svelte';

	let name = '';

	const room = generateSlug();

	function handleEnter() {
		createRoom();
	}

	function createRoom() {
		socket.emit('room:create', { room, name }, (response: TSocketResponse) => {
			if (response.status === 'ok') {
				$modalVisible = false;
				goto(`/${room}`);
			}
		});
	}
</script>

<Modal title="Oda Oluştur">
	<Input bind:value={name} on:enter={handleEnter} />
	<svelte:fragment slot="footer">
		<Button text="Oluştur" on:click={createRoom} disabled={name === ''} />
	</svelte:fragment>
</Modal>

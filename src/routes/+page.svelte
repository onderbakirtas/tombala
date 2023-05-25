<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { io } from 'socket.io-client';

	const socket = io('http://localhost:3000');

	let currentNumber = 0;

	let gameStarted = false;

	let gameFinished = false;

	let electedNumbers: number[] = [];

	socket.on('startgame', () => {
		gameStarted = true;
	});

	socket.on('nextnumber', (msg) => {
		currentNumber = msg;
		electedNumbers.unshift(msg);
		electedNumbers = [...electedNumbers];
	});

	socket.on('endgame', () => {
		gameFinished = true;
		gameStarted = false;
		electedNumbers = [];
	});

	let nonDrawable = true;

	let gameInterval: ReturnType<typeof setInterval>;

	function startGame() {
		socket.emit('startgame');
	}

	function finishGame() {
		clearInterval(gameInterval);
		electedNumbers = [];
		gameStarted = false;
		gameFinished = true;
	}
</script>

<main class="app">
	<h1>Tombala</h1>

	<Card {electedNumbers} />

	{#if !gameStarted}
		<button on:click={startGame}>oyunu baslat</button>
	{:else}
		<h1>{currentNumber}</h1>

		{#if electedNumbers.length > 1}
			<h2>{electedNumbers[1]}</h2>
		{/if}

		<button on:click={finishGame}>oyunu bitir</button>
	{/if}

	{#if gameFinished}
		<div>oyun bitti</div>
	{/if}
</main>

<style>
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}
</style>

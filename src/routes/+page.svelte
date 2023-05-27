<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import type { TGameSession } from '$lib/types';
	import { io } from 'socket.io-client';

	const socket = io('http://192.168.1.35:3000');

	let gameStatus: TGameSession = 'idle';

	let currentNumber: number;

	let gameCounter = 0;

	let electedNumbers: number[] = [];

	socket.on('game:started', () => {
		gameStatus = 'playing';
	});

	socket.on('game:draw', (msg) => {
		gameCounter++;
		currentNumber = msg;
		electedNumbers.unshift(msg);
		electedNumbers = [...electedNumbers];
	});

	socket.on('game:ended', () => {
		gameStatus = 'gameover';
	});

	socket.on('game:restarted', () => {
		gameStatus = 'idle';
		gameCounter = 0;
		electedNumbers = [];
	});

	function startGame() {
		socket.emit('game:start');
	}

	function finishGame() {
		socket.emit('game:end');
	}

	function restartGame() {
		socket.emit('game:restart');
	}
</script>

<main class="app">
	<h1>Tombala</h1>

	<h2>{gameCounter}</h2>

	<Card {electedNumbers} />

	{#if gameStatus === 'idle'}
		<button on:click={startGame}>oyunu baslat</button>
	{/if}

	{#if gameStatus === 'playing'}
		<button on:click={finishGame}>oyunu bitir</button>
		{#if currentNumber}
			<h1>{currentNumber}</h1>
		{/if}

		{#if electedNumbers.length > 1}
			<h2>{electedNumbers[1]}</h2>
		{/if}
	{/if}

	{#if gameStatus === 'gameover'}
		<div>oyun bitti</div>
		<div>
			<button on:click={restartGame}>oyunu sifirla</button>
		</div>
	{/if}
</main>

<style>
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 1rem;
	}
</style>

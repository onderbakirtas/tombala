<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { gameOutcome, modalVisible } from '$lib/store';
	import type { TGameSession } from '$lib/types';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	const socket = io('http://192.168.1.35:3000');

	let gameStatus: TGameSession = 'idle';

	let currentNumber: number;

	let gameCounter = 0;

	let gameCompleted = false;

	let electedNumbers: number[] = [];

	let name = '';

	let currentPlayer = '';

	let winnerPlayer = '';

	let playerSetup = true;

	let players: string[] = [];

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
		gameCompleted = false;
		$gameOutcome = 'unknown';
	});

	socket.on("game:connect", (data) => {
		players = data;
	});

	socket.on('game:finished', (msg) => {
		gameCompleted = true;
		winnerPlayer = msg;
		endGame();
	});

	socket.on('player:joined', (msg) => {
		players.push(msg);
		players = [...players];
		name = '';
	});

	function startGame() {
		socket.emit('game:start');
	}

	function endGame() {
		socket.emit('game:end');
	}

	function restartGame() {
		socket.emit('game:restart');
	}

	function finishGame() {
		socket.emit('game:finish', currentPlayer);
	}

	function handlePayerSetup() {
		currentPlayer = name;
		socket.emit('player:join', name);
		playerSetup = false;
		$modalVisible = false;
	}

	$: {
		if ($gameOutcome === 'win') {
			finishGame();
		}

		if (gameCompleted === true) {
			$modalVisible = true;
		}
	}

	onMount(() => {
		$modalVisible = true;
	});

	onDestroy(() => {
		socket.disconnect();
	});
</script>

<main class="app">
	<h1>Tombala</h1>

	<h2>{currentPlayer}</h2>

	<Card {electedNumbers} />

	{#if gameStatus === 'idle'}
		<button on:click={startGame}>oyunu baslat</button>
	{/if}

	{#if gameStatus === 'playing'}
		<button on:click={endGame}>oyunu bitir</button>
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

	<hr />

	{#if players.length > 0}
		<h2>oyuncular</h2>
		<ul>
			{#each players as player}
				<li>{player}</li>
			{/each}
		</ul>
	{/if}
</main>

{#if gameCompleted && $modalVisible}
	<Modal title="Oyun Bitti">
		{#if $gameOutcome === 'win'}
			<p>Tebrikler, kazandınız.</p>
		{/if}
		{#if $gameOutcome === 'lose'}
			<p>Maalesef, kaybettiniz.</p>
			<p>Kazanan oyuncu: <strong>{winnerPlayer}</strong></p>
		{/if}
	</Modal>
{/if}

{#if playerSetup && $modalVisible}
	<Modal title="Tombala'ya Hosgeldin">
		<input
			type="text"
			bind:value={name}
			placeholder="isminizi girin"
			on:keydown={(e) => {
				if (e.key === 'Enter' && name.length > 0) {
					handlePayerSetup();
				}
			}}
		/>

		<div slot="footer">
			<button on:click={handlePayerSetup} disabled={name.length === 0}>tamam</button>
		</div>
	</Modal>
{/if}

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

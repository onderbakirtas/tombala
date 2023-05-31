<script lang="ts">
	import { PUBLIC_SOCKET_URL } from '$env/static/public';
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Players from '$lib/components/Players.svelte';
	import { gameOutcome, modalVisible } from '$lib/store';
	import type { TGameSession, TPlayerClient } from '$lib/types';
	import { randomCardColor } from '$lib/utils';
	import { darken, opacify, transparentize } from 'color2k';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';

	const socket = io(PUBLIC_SOCKET_URL);

	let cardColor = '#ffbe0b';

	let bgColor = opacify(cardColor, 0.2);

	let darkColor = darken(cardColor, 0.1);

	let gameStatus: TGameSession = 'idle';

	let playerNameInput: HTMLInputElement;

	let currentNumber: number;

	let gameCounter = 0;

	let gameCompleted = false;

	let electedNumbers: number[] = [];

	let name = '';

	let currentPlayer = '';

	let winnerPlayer = '';

	let playerSetup = true;

	let players: TPlayerClient[] = [];

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

		cardColor = randomCardColor();
		bgColor = transparentize(cardColor, 0.75);
		darkColor = darken(cardColor, 0.2);
	});

	socket.on('game:connect', (data) => {
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

	socket.on('player:disconnected', (msg) => {
		players = players.filter((p) => p.id !== msg);
		players = [...players];
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
		cardColor = randomCardColor();
		bgColor = transparentize(cardColor, 0.75);
		darkColor = darken(cardColor, 0.2);
		$modalVisible = true;
		setTimeout(() => {
			playerNameInput.focus();
		}, 100);
	});

	onDestroy(() => {
		socket.emit('player:leave', currentPlayer);
	});
</script>

<main
	class="app"
	style:--bg-color={bgColor}
	style:--text-color={cardColor}
	style:--text-color-dark={darkColor}
>
	<h1>Tombala</h1>

	<!-- <a href="/oda-adi">odaya git</a> -->

	{#key cardColor}
		<Card {electedNumbers} {currentPlayer} {cardColor} />
	{/key}

	<div class="action-row">
		{#if gameStatus === 'idle'}
			<button class="btn" on:click={startGame}>oyuna başla</button>
		{/if}

		{#if gameStatus === 'playing'}
			<!-- <button on:click={endGame}>oyunu bitir</button> -->
			<div class="number-list">
				{#if currentNumber}
					<div class="number-current">{currentNumber}</div>
				{/if}

				<div class="number-olds">
					{#if electedNumbers.length > 0}
						{#each electedNumbers.slice(0, 10) as number}
							{#if number !== currentNumber}
								<div class="number-previous">{number}</div>
							{/if}
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		{#if gameStatus === 'gameover'}
			<button class="btn" on:click={restartGame}>oyunu sifirla</button>
		{/if}
	</div>

	{#if players.length > 0}
		<Players {players} />
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
	<Modal dismissible={false} title="Tombala'ya Hoşgeldin">
		<input
			type="text"
			bind:this={playerNameInput}
			bind:value={name}
			placeholder="oyuncu adı"
			on:keydown={(e) => {
				if (e.key === 'Enter' && name.length > 0) {
					handlePayerSetup();
				}
			}}
		/>

		<div slot="footer" class="modal-buttons">
			<button on:click={handlePayerSetup} disabled={name.length === 0}>tamam</button>
		</div>
	</Modal>
{/if}

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
		height: 100vh;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			background: linear-gradient(0deg, var(--bg-color) 0%, var(--bg-color) 100%);
			background-size: 400% 400%;
			background-attachment: fixed;
			animation: gradient 15s ease infinite;
		}
	}

	.action-row {
		height: 5rem;
		display: flex;
		align-items: center;
	}

	.number {
		&-list {
			display: flex;
			align-items: center;
			gap: 1rem;
			width: 90vw;
			max-width: 40rem;
		}

		&-olds {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		&-current {
			font-size: 2rem;
			font-weight: bold;
			background-color: black;
			color: white;
			width: 3.5rem;
			height: 3.5rem;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		&-previous {
			font-size: 1.125rem;
			font-weight: bold;
			background-color: #999;
			color: white;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.modal-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
</style>

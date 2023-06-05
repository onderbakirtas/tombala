<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Players from '$lib/components/Players.svelte';
	import { socket } from '$lib/socket';
	import { gameOutcome, modalVisible } from '$lib/store';
	import type { TGameSession, TPlayerClient, TSocketResponseData } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';

	let { room } = $page.params;

	let gameStatus: TGameSession = 'idle';

	let playerNameInput: HTMLInputElement;

	let currentNumber: number;

	let gameCounter = 0;

	let gameCompleted = false;

	let electedNumbers: number[] = [];

	let name = '';

	let currentPlayer: TPlayerClient;

	let winnerPlayer = '';

	let playerSetup = true;

	let players: TPlayerClient[] = [];

	// socket.on('game:started', () => {
	// 	gameStatus = 'playing';
	// });

	// socket.on('game:draw', (msg) => {
	// 	gameCounter++;
	// 	currentNumber = msg;
	// 	electedNumbers.unshift(msg);
	// 	electedNumbers = [...electedNumbers];
	// });

	// socket.on('game:ended', () => {
	// 	gameStatus = 'gameover';
	// });

	// socket.on('game:restarted', () => {
	// 	gameStatus = 'idle';
	// 	gameCounter = 0;
	// 	electedNumbers = [];
	// 	gameCompleted = false;
	// 	$gameOutcome = 'unknown';
	// });

	// socket.on('game:connect', (data) => {
	// 	players = data;
	// });

	// socket.on('game:finished', (msg) => {
	// 	gameCompleted = true;
	// 	winnerPlayer = msg;
	// 	endGame();
	// });

	// socket.on('player:joined', (msg) => {
	// 	players.push(msg);
	// 	players = [...players];
	// 	name = '';
	// });

	// socket.on('player:disconnected', (msg) => {
	// 	players = players.filter((p) => p.id !== msg);
	// 	players = [...players];
	// });

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
		currentPlayer.name = name;
		socket.emit('player:join', { currentPlayer, room });
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
		socket.emit('player:list', room, (response: TSocketResponseData<TPlayerClient[]>) => {
			console.log(response);
		});

		socket.on('player:joined', (msg) => {
			console.log(msg);
		});

		// $modalVisible = true;
		// setTimeout(() => {
		// 	playerNameInput.focus();
		// }, 100);
	});

	onDestroy(() => {
		socket.emit('player:leave', currentPlayer);
	});
</script>

{#if currentPlayer}
	<div>
		<Card {electedNumbers} {currentPlayer} />

		<div class="action-row">
			{#if gameStatus === 'idle' && currentPlayer.admin}
				<button class="btn" on:click={startGame}>oyuna başla</button>
			{/if}

			{#if gameStatus === 'playing'}
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

			{#if gameStatus === 'gameover' && currentPlayer.admin}
				<button class="btn" on:click={restartGame}>oyunu sifirla</button>
			{/if}
		</div>

		{#if players.length > 0}
			<Players {players} />
		{/if}
	</div>
{/if}

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

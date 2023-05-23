<script lang="ts">
	import { bingoChecker, shuffleArray } from '$lib/utils';
	import { onMount } from 'svelte';

	let currentNumber = 0;

	let gameStarted = false;

	let gameFinished = false;

	let remainingDraws = 90;

	const gameNumbers = Array.from(Array(90).keys(), (e) => e + 1);

	let electedNumbers: number[] = [];

	function selectRandom(): number {
		if (gameNumbers.length === 0) {
			gameFinished = true;
			return -1;
		}
		let index = Math.floor(Math.random() * gameNumbers.length);
		let number = gameNumbers[index];
		electedNumbers.push(number);
		electedNumbers = [...electedNumbers]
		gameNumbers.splice(index, 1);

		return number;
	}

	let nonDrawable = true;

	let splittedNumbers: number[][] = [];

	const depth = Array.from(Array(9).keys());

	const m = Math.floor(Math.random() * 2) + 1;

	depth.forEach((d) => (splittedNumbers[d] = []));

	splittedNumbers = splittedNumbers.map((_, i) => {
		_ = Array.from(Array(10).keys(), (e) => e + i * 10);

		if (i === 0) _.shift();

		if (i === depth.length - 1) _.push(90);

		return _;
	});

	let bingoNumbers: number[][] = [];

	let finalNumbers: number[] = [];

	const handleBingoNumbers = () => {
		while (nonDrawable) {
			bingoNumbers = splittedNumbers.map((s, j) => {
				const splitter = (j % 2) + 1;

				let item: number[] = [];
				let i = 0;
				let sLength = s.length;

				do {
					i += 1;
					sLength -= 1;
					const random = s[Math.floor(Math.random() * sLength)];
					item.push(random);
					s = s.filter((e) => e !== random);
				} while (i < 3);

				item = item.sort((a, b) => a - b);

				if (m % 2 === 0) {
					if (j === splittedNumbers.length - 2) {
						item = item.splice(splitter - 1, splitter);
					} else {
						item = item.splice(splitter, splitter + 1);
					}
				} else {
					if (j === splittedNumbers.length - 1 || j == 2) {
						item = item.splice(splitter, splitter + 1);
					} else {
						item = item.splice(splitter - 1, splitter);
					}
				}

				item = item.concat(Array(3 - item.length).fill(0));

				shuffleArray(item);

				return item;
			});

			finalNumbers = bingoNumbers.flat();

			nonDrawable = !bingoChecker(bingoNumbers);
		}
	};

	const redraw = () => {
		nonDrawable = true;
		handleBingoNumbers();
	};

	function startGame() {
		const interval = setInterval(() => {
			remainingDraws -= 1;

			if (remainingDraws === 0) {
				clearInterval(interval);
				gameFinished = true;
				return;
			}

			currentNumber = selectRandom();
		}, 1000);
		gameStarted = true;
	}

	onMount(() => {
		handleBingoNumbers();
	});
</script>

<main class="app">
	<h1>Tombala</h1>

	<button on:click={redraw} disabled={gameStarted}>kart cek</button>

	{#if !nonDrawable}
		<div class="card">
			<header class="card-header">
				<div>Tombala</div>
				<div class="card-number">1</div>
			</header>
			<main class="final-numbers">
				{#each finalNumbers as item}
					<div
						class="box"
						class:filled={item > 0}
						class:bingo={electedNumbers.includes(item)}
					>
						{item || ''}
					</div>
				{/each}
			</main>
		</div>
	{/if}

	{#if !gameStarted}
		<button on:click={startGame}>oyunu baslat</button>
	{:else}
		<div>
			<span>{currentNumber}</span>
			<span>{remainingDraws}</span>
		</div>
	{/if}

	{#if gameFinished}
		<div>oyun bitti</div>
	{/if}
</main>

<style>
	.final-numbers {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-auto-flow: column;
		gap: 0.5rem;
	}

	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.card {
		display: inline-flex;
		flex-direction: column;
		border: 1rem solid tomato;
		background-color: tomato;
		border-radius: 0.5rem;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: tomato;
		color: white;
		line-height: 1;
		height: 3rem;
		padding-bottom: 1rem;
	}

	.card-number {
		height: 2rem;
		width: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid white;
		border-radius: 50%;
	}

	.box {
		border-radius: 4px;
		width: 4rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 1.5rem;
		font-weight: 700;
		background-color: rgb(173, 68, 50);
	}

	.box.filled {
		background-color: white;
	}

	.box.bingo {
		background-color: green;
		color: white;
	}
</style>

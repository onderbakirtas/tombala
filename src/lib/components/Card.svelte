<script lang="ts">
	import { gameOutcome } from '$lib/store';
	import type { TPlayerClient } from '$lib/types';
	import { bingoChecker, shuffleArray } from '$lib/utils';
	import { onMount } from 'svelte';

	export let electedNumbers: number[] = [];
	export let nonDrawable = true;
	export let currentPlayer: TPlayerClient;
	export let cardColor = '#ffbe0b';

	let splittedNumbers: number[][] = [];

	const depth = Array.from(Array(9).keys());

	const m = Math.floor(Math.random() * 2) + 1;

	depth.forEach((d) => (splittedNumbers[d] = []));

	let bingoNumbers: number[][] = [];

	let finalNumbers: number[] = [];

	let optimalNumbers: number[] = [];

	splittedNumbers = splittedNumbers.map((_, i) => {
		_ = Array.from(Array(10).keys(), (e) => e + i * 10);

		if (i === 0) _.shift();

		if (i === depth.length - 1) _.push(90);

		return _;
	});

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

			optimalNumbers = [...new Set(finalNumbers)];

			nonDrawable = !bingoChecker(bingoNumbers);
		}
	};

	$: {
		let result = optimalNumbers.filter((e) => electedNumbers.includes(e)).length === 15;

		if (result) {
			gameOutcome.set('win');
		} else {
			gameOutcome.set('lose');
		}
	}

	onMount(() => {
		handleBingoNumbers();
	});
</script>

{#if !nonDrawable}
	<div class="card" style:--card-bg={cardColor}>
		<header class="card-header">
			<div>{currentPlayer.name}</div>
			<div class="card-id">{currentPlayer.id}</div>
		</header>
		<main class="card-numbers">
			{#each finalNumbers as item}
				<div class="box" class:filled={item > 0} class:bingo={electedNumbers.includes(item)}>
					{item || ''}
				</div>
			{/each}
		</main>
	</div>
{/if}

<style>
	.card {
		display: inline-flex;
		flex-direction: column;
		padding: 1rem;
		background-color: var(--card-bg);
		max-width: 40rem;
		width: 90vw;
		border-radius: 8px;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: white;
		line-height: 1;
		height: 3rem;
		padding-bottom: 1rem;
	}

	.card-id {
		height: 2rem;
		padding: 0 1rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid white;
		border-radius: 50%;
	}

	.card-numbers {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		grid-template-rows: repeat(3, 1fr);
		grid-auto-flow: column;
		gap: 0.5rem;
	}

	.box {
		border-radius: 4px;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1 1 auto;
		font-size: 1.5rem;
		font-weight: 700;
		background-color: rgba(0, 0, 0, 0.25);
		user-select: none;
	}

	.box.filled {
		background-color: white;
	}

	.box.bingo {
		background-color: black;
		color: white;
	}

	@media (max-width: 768px) {
		.card-header {
			height: 2rem;
			padding-bottom: 0.5rem;
		}

		.card-id {
			height: 1.5rem;
			width: 1.5rem;
			font-size: 0.75rem;
		}

		.card-numbers {
			gap: 0.25rem;
		}

		.box {
			width: auto;
			height: 2rem;
			font-size: 1rem;
		}
	}
</style>

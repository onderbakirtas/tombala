<script lang="ts">
	import { bingoChecker, shuffleArray } from '$lib/utils';
	import { onMount } from 'svelte';

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

			nonDrawable = !bingoChecker(bingoNumbers);
		}
	};

	const redraw = () => {
		nonDrawable = true
		handleBingoNumbers()
	}

	onMount(() => {
		handleBingoNumbers()
	});
</script>

{#if !nonDrawable}
	<div class="card">
		<header class="card-header">
			<div>Tombala</div>
			<div class="card-number">1</div>
		</header>
		<main class="card-main">
			{#each bingoNumbers as column}
				<div class="column">
					{#each column as item}
						<div class="box" class:filled={item}>{item || ''}</div>
					{/each}
				</div>
			{/each}
		</main>
	</div>
{/if}

<button on:click={redraw}>kart cek</button>

<style>
	.card {
		display: inline-flex;
		flex-direction: column;
		border: 1rem solid tomato;
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

	.card-main {
		display: flex;
		gap: 0.5rem;
		background-color: tomato;
	}

	.column {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
</style>

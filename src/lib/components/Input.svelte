<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let value = '';
	export let placeholder = 'oyuncu adı';

	let element: HTMLInputElement;

	const dispatch = createEventDispatcher();

	function keyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			dispatch('enter', value);
		}
	}

	onMount(() => {
		setTimeout(() => {
			element.focus();
		}, 100);
	});
</script>

<input type="text" bind:this={element} bind:value {placeholder} on:keydown={keyDown} />

<style lang="scss">
	input {
		font-family: inherit;
		font-size: inherit;
		font-weight: 700;
		line-height: 1;
		color: inherit;
		border: none;
    outline: none;
		background-color: #eee;
		width: 100%;
		color: black;
		padding: 0.75rem 1rem;
		border-radius: 0.25em;
    border: 2px solid #ddd;
    text-align: center;
	}

  input:focus {
    border-color: steelblue;
    background-color: #fff;
  }
</style>

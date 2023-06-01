<script>
	import CreateButton from "$lib/components/CreateButton.svelte";

</script>
<div class="intro">
	<h1>TOMBALA</h1>
	<p>Arkadaşlarınla oynamaya başla.</p>
	<CreateButton />
</div>

<style lang="scss">
	.intro {
		display: flex;
		align-items: center;
		flex-direction: column;
		height: 100vh;
		padding-top: 10rem;
		width: 100vw;
		max-width: 40rem;
	}

	h1 {
		margin: 0;
		font-family: 'Rowdies', cursive;
		font-size: 5rem;
		color: steelblue;
		text-shadow: 1px 1px 0 LightSteelBlue, 2px 2px 0 LightSteelBlue, 3px 3px 0 LightSteelBlue,
			4px 4px 0 LightSteelBlue, 5px 5px 0 LightSteelBlue, 6px 6px 0 LightSteelBlue,
			7px 7px 0 LightSteelBlue, 8px 8px 0 LightSteelBlue, 9px 9px 0 LightSteelBlue;
	}

	p {
		font-size: 1.5rem;
		line-height: 1.5;
		text-align: center;
		margin: 2rem 0 3rem;
	}
</style>

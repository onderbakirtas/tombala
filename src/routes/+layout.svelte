<script lang="ts">
	import { darken, transparentize } from 'color2k';
	import '../app.scss';

	let baseColor = 'steelblue';

	let backgroundColor = transparentize(baseColor, 0.75);

	let darkColor = darken(baseColor, 0.25);
</script>

<main
	class="app"
	style:--bg-color={backgroundColor}
	style:--text-color={baseColor}
	style:--text-color-dark={darkColor}
>
	<slot />
</main>

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
</style>

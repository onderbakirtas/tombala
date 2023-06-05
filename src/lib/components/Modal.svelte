<script lang="ts">
	import { modalVisible } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let title = 'Modal Title';

	export let dismissible = true;

	let size = 'sm';

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			hideModal();
		}
	};

	const hideModal = () => {
		if (!dismissible) return;
		$modalVisible = false;
		dispatch('hide');
	};
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modal-overlay"
	class:dismissible
	on:click|self={hideModal}
	transition:fade={{ duration: 100 }}
>
	<div class={`modal modal-${size}`}>
		<div class="modal-header">{title}</div>
		<div class="modal-content">
			<slot />
		</div>
		<footer class="modal-footer">
			<slot name="footer">
				<button class="btn btn-primary" on:click={hideModal}>Tamam</button>
			</slot>
		</footer>
	</div>
</div>

<style lang="scss">
	.modal {
		height: auto;
		background: #fff;
		border-radius: 1rem;
		cursor: auto;
		max-height: 80vh;
		position: relative;
		box-shadow: 0 4px 24px rgba($color: #000000, $alpha: 0.3);
		overflow: hidden;
		text-align: center;

		&-sm {
			width: 24rem;
			max-width: 90%;
		}

		&-md {
			width: 32rem;
		}

		&-lg {
			width: 48rem;
		}

		&-xl {
			width: 56rem;
		}

		&-overlay {
			background: rgba($color: #000000, $alpha: 0.2);
			display: flex;
			align-items: center;
			justify-content: center;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			&.dismissible {
				cursor: pointer;
				pointer-events: auto;
			}
		}

		&-header {
			padding: 1rem 1.5rem;
			font-weight: 700;
			background: #eee;
			min-height: 3.5rem;
			border-bottom: 1px solid #ddd;
			color: #333;
			font-size: 1.125rem;
			line-height: 1.5;
		}

		&-content {
			height: 100%;
			max-height: calc(80vh - 10rem);
			padding: 1.5rem;
			overflow: auto;
		}

		&-footer {
			padding: 1rem 1.5rem;
			border-top: 1px solid #ddd;
			align-items: center;
		}

		:global(&-buttons) {
			display: flex;
			justify-content: center;
		}

		&-close {
			color: #888;
			display: inline-flex;
			align-items: flex-end;
			justify-content: center;
			height: 2rem;
			width: 2rem;
			line-height: 1.5;
			border-radius: 1rem;
			cursor: pointer;
			font-size: 1.5rem;
			position: absolute;
			top: 0.75rem;
			right: 0.75rem;

			&:hover {
				color: #555;
				background: #ddd;
			}
		}
	}
</style>

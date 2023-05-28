<script>
	import { modalVisible } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

  export let title = 'Modal Title';

	let size = 'sm';

	const hideModal = () => {
		$modalVisible = false;
		dispatch('hide');
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modal-overlay" on:click|self={hideModal} transition:fade={{ duration: 100 }}>
	<div class={`modal modal-${size}`}>
		<div class="modal-header">
			<span class="modal-header__title">{title}</span>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="modal-close" on:click={hideModal}>×</span>
		</div>
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

		&-sm {
			width: 24rem;
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
			cursor: pointer;
		}

		&-header {
			padding: 0 4rem 0 1.5rem;
			text-align: left;
			font-weight: 700;
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: #fafafa;
			min-height: 3.5rem;
			border-bottom: 1px solid #ddd;
			color: #333;

			&__title {
				font-size: 1.125rem;
			}
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
		}

		:global(&-buttons) {
			display: flex;
			justify-content: center;
		}

		&-close {
			background: #eee;
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

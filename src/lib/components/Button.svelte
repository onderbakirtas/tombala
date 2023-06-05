<script lang="ts">
	import type { TButtonType } from '$lib/types';

	export let text = 'Button';
	export let type: TButtonType = 'button';
	export let variant = 'primary';
  export let disabled = false;
</script>

<button class="btn btn-{variant}" {type} {disabled} on:click>
	{text}
</button>

<style lang="scss">
	.btn {
		font-family: inherit;
		font-size: inherit;
		font-weight: 700;
		line-height: 1;
		color: inherit;
		border: none;
		border-radius: 0.25em;
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		&:active {
			transform: scale(0.95);
		}

		&:focus {
			outline: none;
		}

		&-primary {
			background-color: forestgreen;
			color: white;

      &[disabled] {
        background-color: #ddd;
        color: #aaa;
        cursor: not-allowed;
        pointer-events: none;
      }

			&:hover {
				background-color: darkgreen;
			}
		}

		&-secondary {
			background-color: #eee;
			color: black;
		}

		&-danger {
			background-color: #ff4136;
			color: white;
		}
	}
</style>

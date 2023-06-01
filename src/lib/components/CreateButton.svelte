<button class="button"><span>oda oluştur</span></button>

<style lang="scss">
	%test {
		position: absolute;
		content: '';
		transition: all 0.25s;
	}

	.button {
		display: inline-block;
		padding: 1rem 1.5rem;
		color: white;
		position: relative;
		font-family: inherit;
		font-size: 1.125rem;
		background-color: mediumseagreen;
		user-select: none;
		box-shadow: 0 1px 0 1px SeaGreen, 0 2px 0 1px SeaGreen, 0 3px 0 1px SeaGreen,
			0 4px 0 1px SeaGreen, 0 5px 0 1px SeaGreen, 0 6px 0 1px SeaGreen;

		&:active {
			top: 4px;
			box-shadow: 0 1px 0 1px SeaGreen, 0 2px 0 1px SeaGreen;
		}
	}
</style>

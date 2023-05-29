<script lang="ts">
	import type { TPlayerClient } from "$lib/types";

  export let players: TPlayerClient[] = [];
</script>


<div class="players">
  <h2>Oyuncular</h2>
  <div class="list">
    {#each players as player}
      <div class="player">
        <div class="player-name">{player.name}</div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .players {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 0 0;
    max-width: 40rem;
    width: 90vw;
    border-radius: 0.5rem;
    background-color: var(--bg-color);
    padding: 1rem;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .list {
    display: flex;
    gap: 0.5rem;
    width: 100%;
  }

  .player {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: var(--text-color-dark);
    background-color: rgba($color: #ffffff, $alpha: 0.4);
  }
</style>

export type TGameSession = 'idle' | 'playing' | 'paused' | 'gameover';

export type TGameOutcome = 'unknown' | 'win' | 'lose';

export type TPlayerClient = {
  id: string;
  name: string;
}

import { writable, type Writable } from 'svelte/store';
import type { TGameOutcome } from './types';

export const modalVisible = writable(false);

export const gameOutcome: Writable<TGameOutcome> = writable('unknown');

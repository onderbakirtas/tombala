import { PUBLIC_SOCKET_URL } from '$env/static/public';
import { io, type Socket } from 'socket.io-client';
import { readable, writable, type Writable } from 'svelte/store';
import type { TGameOutcome } from './types';

export const modalVisible = writable(false);

export const gameOutcome: Writable<TGameOutcome> = writable('unknown');

export const socket = readable<Socket>(io(PUBLIC_SOCKET_URL));

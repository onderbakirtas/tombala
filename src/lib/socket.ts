import { PUBLIC_SOCKET_URL } from '$env/static/public';
import { io } from 'socket.io-client';

export const socket = io(PUBLIC_SOCKET_URL);

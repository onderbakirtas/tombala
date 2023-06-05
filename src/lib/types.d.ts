export type TGameSession = 'idle' | 'playing' | 'paused' | 'gameover';

export type TGameOutcome = 'unknown' | 'win' | 'lose';

export type TPlayerClient = {
	id: string;
	name: string;
	admin: boolean;
};

export type TButtonType = 'submit' | 'reset' | 'button' | undefined;

export type TSocketResponse = {
	status: 'ok' | 'error';
};

export type TSocketResponseData<T> = {
	status: 'ok' | 'error';
	data: T;
};

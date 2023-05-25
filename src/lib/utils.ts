import { CARD_COLORS } from "./constants";

export const shuffleArray = (array: number[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
};

export const bingoChecker = (bingo: number[][]) => {
	const row1Length = bingo.map((b) => b[0] !== 0).filter((e) => e).length;
	const row2Length = bingo.map((b) => b[1] !== 0).filter((e) => e).length;

	return row1Length === 5 && row2Length === 5;
};

export const randomCardColor = () => {
	const index = Math.floor(Math.random() * CARD_COLORS.length);
	return CARD_COLORS[index];
}
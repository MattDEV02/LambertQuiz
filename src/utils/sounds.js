import { Audio } from "expo-av";

const playCorrectAnswerSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/correct_answer_sound.mp3"),
	);
	await sound.playAsync();
};

const playIncorrectAnswerSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/incorrect_answer_sound.mp3"),
	);
	await sound.playAsync();
};

const playSubmitSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/submit_sound.mp3"),
	);
	await sound.playAsync();
};

const playClickSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/click_sound.mp3"),
	);
	await sound.playAsync();
};

const playSuccessSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/success_sound.mp3"),
	);
	await sound.playAsync();
};

const playFailSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/fail_sound.mp3"),
	);
	await sound.playAsync();
};

const playOpenSound = async () => {
	const { sound } = await Audio.Sound.createAsync(
		require("../../assets/sounds/open_sound.mp3"),
	);
	await sound.playAsync();
};

export {
	playCorrectAnswerSound,
	playIncorrectAnswerSound,
	playSubmitSound,
	playClickSound,
	playSuccessSound,
	playFailSound,
	playOpenSound,
};

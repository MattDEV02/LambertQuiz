import { Audio } from "expo-av";


const playSound = async (requiredFile) => {
	const { sound } = await Audio.Sound.createAsync(requiredFile);
	await sound.playAsync();
};

const playCorrectAnswerSound = async () => {
	playSound(require("../../assets/sounds/correct_answer_sound.mp3"));
};

const playIncorrectAnswerSound = async () => {
	playSound(require("../../assets/sounds/incorrect_answer_sound.mp3"));
};

const playSubmitSound = async () => {
	playSound(require("../../assets/sounds/submit_sound.mp3"));
};

const playClickSound = async () => {
	playSound(require("../../assets/sounds/click_sound.mp3"));
};

const playSuccessSound = async () => {
	playSound(require("../../assets/sounds/success_sound.mp3"));
};

const playFailSound = async () => {
	playSound(require("../../assets/sounds/fail_sound.mp3"));
};

const playOpenSound = async () => {
	playSound(require("../../assets/sounds/open_sound.mp3"));
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

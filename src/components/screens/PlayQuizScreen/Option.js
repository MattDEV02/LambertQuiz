import React from "react";
import { Text, TouchableOpacity } from "react-native";
import {
	playCorrectAnswerSound,
	playIncorrectAnswerSound,
} from "../../../utils/sounds";
import { validateObject } from "../../../utils/validators";
import { COLORS } from "../../../constants/theme";

const Option = ({
	option,
	optionIndex,
   question,
   questionIndex,
	questions,
	setQuestions,
	setCorrectCount,
	setIncorrectCount,
}) => {
	const getOptionBackgroundColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			if (currentOption === currentQuestion.solution) {
				return COLORS.success;
			} else if (currentOption === currentQuestion.selectedOption) {
				return COLORS.error;
			} else {
				return COLORS.white;
			}
		} else {
			return COLORS.white;
		}
	};

	const getOptionTextColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			return currentOption === currentQuestion.solution
				? COLORS.white
				: COLORS.black;
		} else {
			return COLORS.black;
		}
	};

	const handleOnOptionPress = async (question, option, index) => {
		if (validateObject(question.selectedOption)) {
			return null; // don't do nothing
		}
		// increase correct and incorrect count
		if (option === question.solution) {
			setCorrectCount((correctCount) => correctCount + 1);
			await playCorrectAnswerSound();
		} else {
			setIncorrectCount((incorrectCount) => incorrectCount + 1);
			await playIncorrectAnswerSound();
		}

		let tempQuestions = [...questions];
		tempQuestions[index].selectedOption = option;
		setQuestions([...tempQuestions]);
	};
	return (
		<TouchableOpacity
			key={optionIndex}
			style={{
				paddingVertical: 15,
				paddingHorizontal: 20,
				borderWidth: 1,
				borderColor: COLORS.border,
				backgroundColor: getOptionBackgroundColor(question, option),
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "flex-start",
			}}
			onPress={() => handleOnOptionPress(question, option, questionIndex)}
		>
			<Text
				style={{
					width: 25,
					height: 25,
					padding: 2,
					borderWidth: 1,
					borderColor: COLORS.border,
					textAlign: "center",
					marginLeft: 15,
					borderRadius: 25,
					color: getOptionTextColor(question, option),
				}}
			>
				{optionIndex + 1}
			</Text>
			<Text
				style={{
					color: getOptionTextColor(question, option),
					marginLeft: 11,
					fontSize: 14.5,
				}}
			>
				{option}
			</Text>
		</TouchableOpacity>
	);
};

export default Option;

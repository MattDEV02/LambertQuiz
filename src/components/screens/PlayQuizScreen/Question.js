import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import Option from "./Option";
import NoImage from "./NoImage";
import { validateURL, validateImageExt } from "../../../utils/validators";
import { COLORS, questionsNumber } from "../../../constants/theme";

const Question = ({
	question,
	questionIndex,
	questions,
	setQuestions,
	setCorrectCount,
	setIncorrectCount,
}) => {
	const [imagesError, setImagesError] = useState([]);

	useEffect(() => {
		let tempImagesError = [];
		for (i = 0; i < questionsNumber; i++) {
			tempImagesError[i] = false;
		}
		setImagesError(tempImagesError);
	}, []);

	const handleImageError = (questionIndex) => {
		let updatedImagesError = [...imagesError];
		updatedImagesError[questionIndex] = true;
		setImagesError(updatedImagesError);
	};

	return (
		<View
			style={{
				marginTop: 12,
				marginHorizontal: 10,
				backgroundColor: COLORS.white,
				elevation: 2,
				borderRadius: 2,
			}}
		>
			<View style={{ padding: 20 }}>
				<Text style={{ fontSize: 16 }}>
					{questionIndex + 1}. {question.text}
				</Text>
				{validateURL(question.imageurl) &&
				validateImageExt(question.imageurl) &&
				!imagesError[questionIndex] ? (
					<Image
						source={{
							uri: question.imageurl,
						}}
						resizeMode={"contain"}
						alt={"Questio Image"}
						onError={() => handleImageError(questionIndex)}
						style={{
							width: "80%",
							height: 150,
							marginTop: 20,
							marginLeft: "10%",
							borderRadius: 5,
						}}
					/>
				) : (
					<NoImage />
				)}
			</View>
			{/* Options */}
			{question.options.map((option, optionIndex) => (
				<Option
					option={option}
					optionIndex={optionIndex}
					question={question}
					questionIndex={questionIndex}
					questions={questions}
					setQuestions={setQuestions}
					setCorrectCount={setCorrectCount}
					setIncorrectCount={setIncorrectCount}
					key={optionIndex}
				/>
			))}
		</View>
	);
};

export default Question;

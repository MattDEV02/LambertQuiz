import React, { useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	FlatList,
	Image,
	TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, appName } from "../constants/theme";
import FormButton from "../components/shared/FormButton";
import ResultModal from "../components/PlayQuizScreen/ResultModal";
import {
	validateObject,
	validateString,
	validateURL,
} from "../utils/validators";
import NoImage from "../components/PlayQuizScreen/NoImage";

// TODO: QUESTION COMPONENT.

const PlayQuizScreen = ({ navigation }) => {
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [isResultModalVisible, setIsResultModalVisible] = useState(false);
	const [questions, setQuestions] = useState([
		{
			question: "How much is tall the Eiffel Tower ?",
			imageUrl:
				"https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg",
			allOptions: ["71 meters", "72 meters", "1 metre", "0 meters"],
			selectedOption: null, // qui ci metti null e poi lo modifichi
			correct_answer: "71 meters",
		},
		{
			question: "How much is large the Giza Sphinx ?",
			imageUrl: "https://www.focus.it/images/2023/03/14/sfinge-orig.jpg",
			allOptions: ["10 meters", "72 meters", "1 metre", "100 meters"],
			selectedOption: null,
			correct_answer: "72 meters",
		},
		{
			question: "How much is 3 + 2 ?",
			imageUrl:
				"https://t3.ftcdn.net/jpg/04/83/90/18/360_F_483901821_46VsNR67uJC3xIKQN4aaxR6GtAZhx9G8.jpg",
			allOptions: ["5", "18", "0", "-2"],
			selectedOption: null,
			correct_answer: "5",
		},
	]);

	const getOptionBgColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			return currentQuestion.correct_answer === currentOption
				? COLORS.success
				: COLORS.error;
		} else return COLORS.white;
	};

	const getOptionTextColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			return currentQuestion.correct_answer === currentOption
				? COLORS.white
				: COLORS.black;
		} else return COLORS.black;
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				position: "relative",
			}}
		>
			<StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
			{/* TOP BAR */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingVertical: 10,
					paddingHorizontal: 20,
					backgroundColor: COLORS.white,
					elevation: 4,
				}}
			>
				<View>
					{/* TITLE */}
					<Text
						style={{
							fontSize: 17.5,
						}}
					>
						{appName}
					</Text>
				</View>
				{/* Corret and Incorrect */}
				<View
					style={{
						flexDirection: "row",
						alignItems: "right",
						justifyContent: "flex-end",
					}}
				>
					{/* Correct */}
					<View
						style={{
							backgroundColor: COLORS.success,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
						}}
					>
						<MaterialIcons
							name="check"
							size={14}
							style={{ color: COLORS.white }}
						/>
						{/* correct count */}
						<Text style={{ color: COLORS.white, marginLeft: 6 }}>
							{correctCount}
						</Text>
					</View>
					{/* Incorrect */}
					<View
						style={{
							backgroundColor: COLORS.error,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingHorizontal: 10,
							paddingVertical: 4,
							borderTopRightRadius: 10,
							borderBottomRightRadius: 10,
						}}
					>
						<MaterialIcons
							name="close"
							size={14}
							style={{ color: COLORS.white }}
						/>
						{/* incorrect count */}
						<Text style={{ color: COLORS.white, marginLeft: 6 }}>
							{incorrectCount}
						</Text>
					</View>
				</View>
			</View>
			{/* Questions and Options */}
			<FlatList
				data={questions}
				style={{ flex: 1, backgroundColor: COLORS.background }}
				showsVerticalScrollIndicator={true}
				keyExtractor={(item) => item.question}
				renderItem={({ item, index }) => (
					<View
						style={{
							marginTop: 14,
							marginHorizontal: 10,
							backgroundColor: COLORS.white,
							elevation: 2,
							borderRadius: 2,
						}}
					>
						<View style={{ padding: 20 }}>
							<Text style={{ fontSize: 16 }}>
								{index + 1}. {item.question}
							</Text>
							{validateURL(item.imageUrl) ? (
								<Image
									source={{
										uri: item.imageUrl,
									}}
									resizeMode={"contain"}
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
						{item.allOptions.map((option, optionIndex) => {
							return (
								<TouchableOpacity
									key={optionIndex}
									style={{
										paddingVertical: 15,
										paddingHorizontal: 20,
										borderTopWidth: 1,
										borderColor: COLORS.border,
										backgroundColor: getOptionBgColor(
											item,
											option,
											optionIndex,
										),
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-start",
									}}
									onPress={() => {
										// ?
										if (item.selectedOption) {
											return null;
										}
										// increase correct and incorrect count
										option === item.correct_answer
											? setCorrectCount(correctCount + 1)
											: setIncorrectCount(incorrectCount + 1);

										//
										let tempQuestions = [...questions];
										tempQuestions[index].selectedOption = option;
										setQuestions([...tempQuestions]);
									}}
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
											color: getOptionTextColor(item, option),
										}}
									>
										{optionIndex + 1}
									</Text>
									<Text
										style={{
											color: getOptionTextColor(item, option),
											marginLeft: 11,
											fontSize: 14.5,
										}}
									>
										{option}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				)}
				ListFooterComponent={() => (
					<FormButton
						labelText="Submit"
						style={{ margin: 12, borderRadius: 14 }}
						handleOnPress={() => {
							// Show Result modal
							setIsResultModalVisible(true);
						}}
					/>
				)}
			/>
			{/* Result Modal */}
			<ResultModal
				isModalVisible={isResultModalVisible}
				correctCount={correctCount}
				incorrectCount={incorrectCount}
				totalCount={questions.length}
				handleOnClose={() => {
					setIsResultModalVisible(false);
				}}
				handleOnRetry={() => {
					setCorrectCount(0);
					setIncorrectCount(0);
					//getQuizAndQuestionDetails();
					setIsResultModalVisible(false);
					navigation.goBack();
					navigation.navigate("Play Quiz page");
				}}
				handleOnGoHome={() => {
					setIsResultModalVisible(false);
					navigation.goBack();
				}}
			/>
		</SafeAreaView>
	);
};

export default PlayQuizScreen;

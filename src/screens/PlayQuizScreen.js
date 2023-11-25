import React, { useState, useEffect } from "react";
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
	validateURL,
	validateArray,
} from "../utils/validators";
import NoImage from "../components/PlayQuizScreen/NoImage";
import { supabase } from "../app/lib/supabase-client";
import { Audio } from "expo-av";

// TODO: QUESTION COMPONENT.

const PlayQuizScreen = ({ navigation, route }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [isResultModalVisible, setIsResultModalVisible] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [tryAgain, setTryAgain] = useState(false);

	const quizId = route.params.quizId,
		openedQuiz = route.params.openedQuiz;

	useEffect(() => {
		const getQuestionsFromQuizId = async (quizId) => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc("get_random_questions", {
				quiz_id: quizId,
			});
			if (validateObject(error)) {
				console.error(error);
			} else if (validateArray(data, 5)) {
				setQuestions(data);
			}
			setRefreshing(false);
		};

		getQuestionsFromQuizId(quizId);
	}, [openedQuiz, tryAgain]);

	navigation.addListener("focus", () => {
		setQuestions([]);
	});

	navigation.addListener("blur", () => {
		setQuestions([]);
		navigation.setParams({ openedQuiz: false });
	});

	const getOptionBackgroundColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			if (currentOption === currentQuestion.solution) return COLORS.success;
			else if (currentOption === currentQuestion.selectedOption)
				return COLORS.error;
			else return COLORS.white;
		} else return COLORS.white;
	};

	const getOptionTextColor = (currentQuestion, currentOption) => {
		if (
			validateObject(currentQuestion) &&
			validateObject(currentQuestion.selectedOption)
		) {
			if (currentOption === currentQuestion.solution) return COLORS.white;
			else return COLORS.black;
		} else return COLORS.black;
	};

	async function playCorrectAnswerSound() {
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/sounds/correct_answer_sound.mp3"),
		);
		await sound.playAsync();
	}

	async function playIncorrectAnswerSound() {
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/sounds/incorrect_answer_sound.mp3"),
		);
		await sound.playAsync();
	}

	async function playSubmitSound() {
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/sounds/submit_sound.mp3"),
		);
		await sound.playAsync();
	}

	const handleOnOptionPress = async (item, option, index) => {
		//
		if (validateObject(item.selectedOption)) {
			return null;
		}
		// increase correct and incorrect count
		if (option === item.solution) {
			setCorrectCount(correctCount + 1);
			await playCorrectAnswerSound();
		} else {
			setIncorrectCount(incorrectCount + 1);
			await playIncorrectAnswerSound();
		}

		//
		let tempQuestions = [...questions];
		tempQuestions[index].selectedOption = option;
		setQuestions([...tempQuestions]);
	};

	const handleOnSubmit = async () => {
		await playSubmitSound();
		setIsResultModalVisible(true);
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				position: "relative",
			}}
		>
			<StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
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
				<View
					style={{
						flexDirection: "row",
						alignItems: "right",
						justifyContent: "flex-end",
					}}
				>
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
						}}
					>
						60
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
				onRefresh={() => undefined}
				refreshing={refreshing}
				keyExtractor={(item) => item.text}
				renderItem={({ item, index }) => (
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
								{index + 1}. {item.text}
							</Text>
							{validateURL(item.imageurl) ? (
								<Image
									source={{
										uri: item.imageurl,
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
						{item.options.map((option, optionIndex) => {
							return (
								<TouchableOpacity
									key={optionIndex}
									style={{
										paddingVertical: 15,
										paddingHorizontal: 20,
										borderWidth: 1,
										borderColor: "#E8E6E6",
										backgroundColor: getOptionBackgroundColor(
											item,
											option,
										),
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "flex-start",
									}}
									onPress={() =>
										handleOnOptionPress(item, option, index)
									}
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
						handleOnPress={() => handleOnSubmit()}
					/>
				)}
			/>
			{/* Result Modal */}
			<ResultModal
				isModalVisible={isResultModalVisible}
				correctCount={correctCount}
				incorrectCount={incorrectCount}
				totalCount={questions.length}
				totalSeconds={60}
				handleOnClose={() => {
					setCorrectCount(0);
					setIncorrectCount(0);
					setIsResultModalVisible(false);
				}}
				handleOnRetry={() => {
					setCorrectCount(0);
					setIncorrectCount(0);
					setIsResultModalVisible(false);
					setTryAgain(!tryAgain);
				}}
				handleOnGoHome={() => {
					setCorrectCount(0);
					setIncorrectCount(0);
					setIsResultModalVisible(false);
					navigation.navigate("Home page");
				}}
			/>
		</SafeAreaView>
	);
};

export default PlayQuizScreen;

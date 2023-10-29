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
import { validateObject, validateURL } from "../utils/validators";
import NoImage from "../components/PlayQuizScreen/NoImage";
import { supabase } from "../app/lib/supabase-client";
import { getQuestionsFromQuizId } from "../utils/database";

// TODO: QUESTION COMPONENT.

const PlayQuizScreen = ({ navigation, route }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [currentQuizId, setCurrentQuizId] = useState(route.params.quizId);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [isResultModalVisible, setIsResultModalVisible] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [tryAgain, setTryAgain] = useState(false);

	useEffect(() => {
		const getQuestionsFromQuizId = async (quizId) => {
			setRefreshing(true);
			const { data, error } = await supabase
				.from("questions")
				.select()
				.eq("quiz", quizId);
			if (validateObject(error)) {
				console.error(error);
			}
			setQuestions(data);
			setRefreshing(false);
		};

		getQuestionsFromQuizId(currentQuizId);
	}, [tryAgain]);

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

	const handleOnOptionPress = (item, option, index) => {
		// ?
		if (item.selectedOption) {
			return null;
		}
		// increase correct and incorrect count
		if (option === item.solution) {
			setCorrectCount(correctCount + 1);
		} else {
			setIncorrectCount(incorrectCount + 1);
		}

		//
		let tempQuestions = [...questions];
		tempQuestions[index].selectedOption = option;
		setQuestions([...tempQuestions]);
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
						handleOnPress={() => setIsResultModalVisible(true)}
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
					setIsResultModalVisible(false);
					setTryAgain(!tryAgain);
				}}
				handleOnGoHome={() => {
					setIsResultModalVisible(false);
					navigation.navigate("Home page");
				}}
			/>
		</SafeAreaView>
	);
};

export default PlayQuizScreen;

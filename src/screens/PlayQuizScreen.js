import React, { useState, useEffect, useRef } from "react";
import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Question from "../components/screens/PlayQuizScreen/Question";
import FormButton from "../components/shared/FormButton";
import ResultModal from "../components/screens/PlayQuizScreen/ResultModal";
import { supabase } from "../app/lib/supabase-client";
import {
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { storeProgress } from "../utils/database";
import { playOpenSound } from "../utils/sounds";
import { COLORS, appName, questionsNumber } from "../constants/theme";

let startDate = null,
	endDate = null,
	totalSeconds = 0;

const PlayQuizScreen = ({ navigation, route }) => {
	const quizId = route.params.quizId,
		openedQuiz = route.params.openedQuiz;

	const user = route.params.user;

	const [refreshing, setRefreshing] = useState(false);
	const [isResultModalVisible, setIsResultModalVisible] = useState(false);
	const [tryAgain, setTryAgain] = useState(false);
	const [gameFinished, setGameFinished] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const [incorrectCount, setIncorrectCount] = useState(0);
	const [questions, setQuestions] = useState([]);

	const flatListRef = useRef(null);

	const scrollToTop = () => {
		if (validateObject(flatListRef.current))
			flatListRef.current.scrollToIndex({ index: 0 });
	};

	useEffect(() => {
		const getQuestionsFromQuizId = async (quizId) => {
			if (openedQuiz && !gameFinished) {
				setRefreshing(true);
				await playOpenSound();
				const { data, error } = await supabase.rpc("get_random_questions", {
					quiz_id: quizId,
				});
				if (validateObject(error)) {
					console.error(error);
				} else if (validateArray(data, questionsNumber)) {
					startDate = new Date();
					setQuestions(data);
					scrollToTop();
				}
				setRefreshing(false);
			}
		};

		getQuestionsFromQuizId(quizId);
	}, [openedQuiz, tryAgain]);

	navigation.addListener("blur", () => {
		navigation.setParams({ openedQuiz: false });
		setTryAgain(false);
		setQuestions([]);
	});

	const handleOnSubmit = () => {
		setGameFinished(true);
		endDate = new Date();
		totalSeconds = (Math.abs(endDate - startDate) / 1000).toFixed(2);
		setIsResultModalVisible(true);
		setTryAgain(false);
		storeProgress(user.user_id, quizId, startDate, endDate, correctCount);
	};

	const handleOnModalClose = () => {
		setIsResultModalVisible(false);
		setCorrectCount(0);
		setIncorrectCount(0);
		setGameFinished(false);
	};

	const handleOnQuizClose = () => {
		navigation.setParams({ openedQuiz: false });
		navigation.navigate("Home page");
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				position: "relative",
			}}
		>
			{/* TOP BAR */}
			<View
				style={{
					...style.container,
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
					{/* Category */}
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
						}}
					>
						{validateArray(questions, questionsNumber) &&
						validateString(questions[0].category)
							? questions[0].category
							: null}
					</Text>
				</View>
				{/* Corret and Incorrect */}
				<View
					style={{
						...style.container,
					}}
				>
					{/* Correct */}
					<View
						style={{
							...style.container,
							backgroundColor: COLORS.success,
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
							...style.container,
							backgroundColor: COLORS.error,
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
				ref={flatListRef}
				data={questions}
				style={{ flex: 1, backgroundColor: COLORS.background }}
				showsVerticalScrollIndicator={true}
				onRefresh={() => undefined}
				refreshing={refreshing}
				keyExtractor={(item) => item.text}
				renderItem={({ item: question, index }) => (
					<Question
						question={question}
						questionIndex={index}
						questions={questions}
						setQuestions={setQuestions}
						setCorrectCount={setCorrectCount}
						setIncorrectCount={setIncorrectCount}
					/>
				)}
				ListFooterComponent={() => (
					<FormButton
						labelText="Submit"
						style={{ margin: 12, borderRadius: 15 }}
						textStyle={{ color: COLORS.white, fontSize: 22 }}
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
				seconds={totalSeconds}
				handleOnClose={() => {
					handleOnModalClose();
					handleOnQuizClose();
				}}
				handleOnRetry={() => {
					handleOnModalClose();
					setTryAgain(true);
				}}
				handleOnGoHome={() => {
					handleOnModalClose();
					handleOnQuizClose();
				}}
			/>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default PlayQuizScreen;

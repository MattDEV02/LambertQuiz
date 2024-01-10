import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, FlatList } from "react-native";
import PlayNavBar from "../components/screens/PlayQuizScreen/PlayNavBar";
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
import { COLORS, questionsNumber } from "../constants/theme";

let startDate = null,
	endDate = null,
	totalSeconds = 0;

const PlayQuizScreen = ({ navigation, route }) => {
	const quiz_id = route.params.quizId,
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
		if (validateObject(flatListRef.current)) {
			flatListRef.current.scrollToIndex({ index: 0 });
		}
	};

	useEffect(() => {
		const getQuestionsFromQuizId = async (quiz_id) => {
			if (openedQuiz && !gameFinished) {
				setRefreshing(true);
				await playOpenSound();
				const { data, error } = await supabase.rpc("get_random_questions", {
					quiz_id,
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

		getQuestionsFromQuizId(quiz_id);
	}, [openedQuiz, tryAgain]);

	navigation.addListener("blur", () => {
		handleOnModalClose(); //
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
		storeProgress(user.user_id, quiz_id, startDate, endDate, correctCount);
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

			{validateArray(questions, questionsNumber) &&
			validateObject(questions[0]) &&
			validateString(questions[0].category) ? (
				<PlayNavBar
					category={questions[0].category}
					correctCount={correctCount}
					incorrectCount={incorrectCount}
				/>
			) : null}
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

export default PlayQuizScreen;

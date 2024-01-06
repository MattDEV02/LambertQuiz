import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, FlatList, ScrollView } from "react-native";
import { supabase } from "../app/lib/supabase-client";
import Quiz from "../components/screens/HomeScreen/Quiz";
import FormInput from "../components/shared/FormInput";
import { COLORS } from "../constants/theme";
import {
	validateObject,
	validateString,
	validateArray,
} from "../utils/validators";
import { playClickSound } from "../utils/sounds";

const HomeScreen = ({ navigation, route }) => {
	//console.log(route.params.user);
	const user = route.params.user;
	const [quizzes, setQuizzes] = useState([]);
	const [quiz, setQuiz] = useState("");
	const [searching, setSearching] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		const getQuizzes = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.from("quizzes").select();
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			}
			if (validateArray(data, 1)) setQuizzes(data);
			setRefreshing(false);
		};

		const getQuizzesWithSearching = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc("get_searched_quizzes", {
				quiz_category: quiz,
			});
			console.log(data);
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			}
			if (validateArray(data, 1)) {
				setQuizzes(data);
			} else {
				//setQuizzes([]);
				setSearching(false);
				getQuizzes();
			}
			setRefreshing(false);
		};

		searching ? getQuizzesWithSearching() : getQuizzes();

	}, [quiz]);

	const handleOnPlayPress = async (quiz_id) => {
		await playClickSound();
		navigation.setParams({ quizId: quiz_id });
		navigation.navigate("Play Quiz page", {
			quizId: quiz_id,
			openedQuiz: true,
		});
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
				position: "relative",
			}}
		>
			{/* TOP BAR */}
			<ScrollView
				style={{
					marginBottom: 6.75,
				}}
			>
				<View>
					{/* Welcome title */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							marginTop: 27.5,
						}}
					>
						<Text
							style={{
								fontSize: 27,
								color: COLORS.black,
								fontWeight: "bold",
							}}
						>
							Welcome{" "}
							{validateObject(user) && validateString(user.username)
								? user.username
								: null}{" "}
							!
						</Text>
					</View>

					{/* Quiz search form */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<FormInput
							placeholderText="Search a Quiz"
							value={quiz}
							maxLength={15}
							autoComplete={"name"}
							autoCorrect={true}
							inputMode={"text"}
							keyboardType={"default"}
							inputError={false}
							inputSuccess={false}
							onChangeText={(quiz) => {
								setQuiz(quiz);
								setSearching(true);
							}}
							style={{ width: "89.5%" }}
							inputStyle={{
								marginTop: 7.5,
								marginBottom: 6,
								paddingVertical: 15,
								backgroundColor: COLORS.white,
								borderWidth: 0.35,
								borderColor: COLORS.secondary,
								borderRadius: 12,
								fontSize: 16,
							}}
						/>
					</View>
					{/* Quiz list */}
					<FlatList
						data={quizzes}
						scrollEnabled={false}
						onRefresh={() => undefined}
						refreshing={refreshing}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item) => item.title}
						renderItem={({ item: quiz }) => (
							<Quiz
								quiz={quiz}
								handleOnPlayPress={() =>
									handleOnPlayPress(quiz.quiz_id)
								}
							/>
						)}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

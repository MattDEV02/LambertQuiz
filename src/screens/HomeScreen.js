import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	FlatList,
	ScrollView,
	StyleSheet,
} from "react-native";
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
	const user = route.params.user;
	const [quizzes, setQuizzes] = useState([]);
	const [quiz, setQuiz] = useState("");
	const [searching, setSearching] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		const getQuizzes = async () => {
			setRefreshing(true);
			const { data, error } = await supabase
				.from("quizzes")
				.select()
				.order("category");
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			} else if (validateArray(data, 1)) {
				setQuizzes(data);
			}
			setRefreshing(false);
		};

		const getQuizzesWithSearching = async () => {
			setRefreshing(true);
			const { data, error } = await supabase.rpc("get_searched_quizzes", {
				quiz_category: quiz,
			});
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			} else if (validateArray(data, 0)) {
				setQuizzes(data);
			} else if (!validateString(quiz)) {
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
							...style.container,
							marginTop: 27.5,
						}}
					>
						<Text style={{ ...style.text, fontSize: 29 }}>
							Welcome{" "}
							{validateObject(user) && validateString(user.username)
								? user.username
								: null}{" "}
							!
						</Text>
					</View>

					{/* Quiz search form */}
					<View style={style.container}>
						<FormInput
							placeholderText="Search for a Quiz"
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
							style={{ width: "89%" }}
							inputStyle={{
								marginTop: 7.5,
								marginBottom: 5,
								paddingVertical: 15,
								backgroundColor: COLORS.white,
								borderWidth: 0.35,
								borderColor: COLORS.secondary,
								borderRadius: 11,
								fontSize: 16,
							}}
						/>
					</View>
					{/* Quiz list */}
					{validateArray(quizzes, 1) ? (
						<FlatList
							data={quizzes}
							scrollEnabled={false}
							onRefresh={() => undefined}
							refreshing={refreshing}
							showsVerticalScrollIndicator={false}
							keyExtractor={(item) => item.quiz_id}
							renderItem={({ item: quiz }) => (
								<Quiz
									quiz={quiz}
									handleOnPlayPress={() =>
										handleOnPlayPress(quiz.quiz_id)
									}
								/>
							)}
						/>
					) : searching ? (
						<View style={{ ...style.container, marginTop: 47 }}>
							<Text style={{ ...style.text, color: "#EF0909" }}>
								NO Quizzes found.
							</Text>
						</View>
					) : null}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const style = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		fontSize: 26.5,
		color: COLORS.black,
		fontWeight: "bold",
	},
});

export default HomeScreen;

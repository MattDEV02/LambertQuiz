import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	FlatList,
	ScrollView,
} from "react-native";
import { supabase } from "../app/lib/supabase-client";
import Quiz from "../components/screens/HomeScreen/Quiz";
import { COLORS } from "../constants/theme";
import {
	validateObject,
	validateString,
	validateArray,
} from "../utils/validators";
import { playClickSound } from "../utils/sounds";

const HomeScreen = ({ navigation, route }) => {
	console.log(1, route.params.user);
	const [user, setUser] = useState(route.params.user);
	const [quizzes, setQuizzes] = useState([]);
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
			else console.error("Invalid Data!");
			setRefreshing(false);
		};

		getQuizzes();
	}, []);

	const handleOnPlayPress = async (quiz_id) => {
		await playClickSound();
		navigation.setParams({ quizId: quiz_id });
		navigation.navigate("Play Quiz page", {
			quizId: quiz_id,
			openedQuiz: true
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
			<StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
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
							marginBottom: 23,
						}}
					>
						<Text
							style={{
								fontSize: 25,
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

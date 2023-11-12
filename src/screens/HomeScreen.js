import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	FlatList,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/theme";
import Quiz from "../components/HomeScreen/Quiz";
import { supabase } from "../app/lib/supabase-client";
import {
	validateObject,
	validateString,
	validateArray,
} from "../utils/validators";

const HomeScreen = ({ navigation, route }) => {
	//console.log("User from app.js: ", route.params.user);
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

		const getUserUsernameFromEmail = async (email) => {
			const { data, error } = await supabase
				.from("users")
				.select("username")
				.eq("email", email)
				.single(); // UNIQUE
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				const tempUser = data;
				tempUser.username = data.username;
				setUser(tempUser);
			}
		};
		getUserUsernameFromEmail(user.email);
		getQuizzes();
	}, []);

	const handleOnPlayPress = (quiz_id) => {
		navigation.setParams({ quizId: quiz_id });
		navigation.navigate("Play Quiz page", {
			quizId: quiz_id,
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
								fontSize: 24.3,
								color: COLORS.black,
								fontWeight: "bold",
							}}
						>
							Benvenuto{" "}
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

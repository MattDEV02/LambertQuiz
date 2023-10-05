import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	FlatList,
	TouchableOpacity,
} from "react-native";
/* 
import { signOut } from "../utils/auth";
import FormButton from "../components/shared/FormButton";
//import { COLORS } from "../constants/theme";
import { getQuizzes } from "../utils/database";
*/

const HomeScreen = ({ navigation }) => {
	const [allQuizzes, setAllQuizzes] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const getAllQuizzes = async () => {
		setRefreshing(true);
		const quizzes = await getQuizzes();

		// Transform quiz data
		let tempQuizzes = [];
		await quizzes.docs.forEach(async (quiz) => {
			await tempQuizzes.push({ id: quiz.id, ...quiz.data() });
		});
		await setAllQuizzes([...tempQuizzes]);

		setRefreshing(false);
	};

	useEffect(() => {
		getAllQuizzes();
	}, []);

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: COLORS.white,
				elevation: 4,
				paddingHorizontal: 20,
			}}
		>
			<Text style={{ fontSize: 20, color: COLORS.black }}>Quiz App</Text>
			<Text
				style={{
					fontSize: 20,
					padding: 10,
					color: COLORS.error,
				}}
				onPress={signOut}
			>
				Logout
			</Text>
		</View>
	);
};

export default HomeScreen;

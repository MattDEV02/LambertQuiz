import React, { useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	FlatList,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { COLORS } from "../constants/theme";
import FormButton from "../components/shared/FormButton";
import { signOut } from "../utils/auth";
import { validateString } from "../utils/validators";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import Quiz from "../components/HomeScreen/Quiz";

// TODO: QUIZ COMPONENT.

// TODO: Icon COMPONENT.

const HomeScreen = ({ navigation }) => {
	const iconsSize = 19,
		iconsPaddingHorizontal = 11.5,
		iconsPaddingVertical = 7;
	const [quizzes, setQuizzes] = useState([
		{
			title: "Egypt",
			description: "Egypt culture quizzz.",
			id: 1,
		},
		{
			title: "France",
			description: "France culture quizzz.",
			id: 2,
		},
		{
			title: "Math",
			description: "Math culture quizzz.",
			id: 3,
		},
		{
			title: "Boh",
			description: "Lorem Ipsum Lorem Ipsum",
			id: 4,
		},
		{
			title: "Football",
			description: "Who is the best between Pellegrini and Dybala?",
			id: 5,
		},
		{
			title: "Computer Science",
			description: "Who is the best between Windows and Mac?",
			id: 6,
		},
		{
			title: "Comics",
			description: "Who is the best between Superman and Batman?",
			id: 7,
		},
	]);
	const [refreshing, setRefreshing] = useState(false);

	const username = "username";

	const handleOnPlayPress = (quiz) => {
		navigation.navigate("Play Quiz page", {
			quizId: quiz.id,
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
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						backgroundColor: COLORS.white,
						paddingBottom: 6.75,
						borderBottomColor: COLORS.secondary,
						borderBottomWidth: 0.5,
					}}
				>
					{/* Account and Stats */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-start",
							marginLeft: 16.5,
							marginBottom: 1.5,
						}}
					>
						{/* account */}
						<View
							style={{
								backgroundColor: COLORS.primary,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: iconsPaddingHorizontal,
								paddingVertical: iconsPaddingVertical,
								borderTopLeftRadius: 10,
								borderBottomLeftRadius: 10,
								borderWidth: 0.92,
								borderColor: COLORS.black,
							}}
						>
							<MaterialIcons
								name="user-circle"
								size={iconsSize}
								style={{ color: COLORS.white }}
								onPress={() => navigation.navigate("Account page")}
							/>
						</View>
						{/* stats */}
						<View
							style={{
								backgroundColor: "#79828A",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								paddingHorizontal: iconsPaddingHorizontal,
								paddingVertical: iconsPaddingVertical,
								borderTopRightRadius: 10,
								borderBottomRightRadius: 10,
								borderWidth: 0.92,
								borderColor: COLORS.black,
							}}
						>
							<MaterialIcons
								name="bar-chart-o"
								size={iconsSize}
								style={{ color: COLORS.white }}
								onPress={() => navigation.navigate("Stats page")}
							/>
						</View>
					</View>
					{/* Logout */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "right",
							justifyContent: "flex-end",
							marginRight: 18.5,
							marginBottom: 1.5,
						}}
					>
						<Text
							style={{
								fontSize: 21.5,
								padding: 5,
								color: COLORS.error,
								fontWeight: "500",
							}}
							onPress={() => signOut()}
						>
							Logout
						</Text>
					</View>
				</View>
				<View>
					{/* Welcome title */}
					<View
						style={{
							//flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginVertical: 27,
						}}
					>
						<Text
							style={{
								fontSize: 24,
								color: COLORS.black,
								fontWeight: "bold",
							}}
						>
							Benvenuto {username} !
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
								handleOnPlayPress={() => handleOnPlayPress(quiz)}
							/>
						)}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;

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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// TODO: QUIZ COMPONENT.

const HomeScreen = ({ navigation }) => {
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
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
				position: "relative",
			}}
		>
			<StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
			<View
				style={{
					flexDirection: "row",
					alignItems: "right",
					justifyContent: "flex-end",
					backgroundColor: COLORS.white,
					paddingHorizontal: 20,
					paddingBottom: 5,
					borderBottomColor: COLORS.secondary,
					borderBottomWidth: 0.5,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
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
						{/* account */}
					</View>
					{/* settings */}
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
					</View>
					<View>
						<Text
							style={{
								fontSize: 20.5,
								padding: 5,
								color: COLORS.error,
							}}
							onPress={() => signOut()}
						>
							Logout
						</Text>
					</View>
				</View>
			</View>
			<View>
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<Text
						style={{
							fontSize: 24,
							color: COLORS.black,
							fontWeight: "bold",
							marginVertical: 24,
						}}
					>
						Benvenuto {username} !
					</Text>
				</View>
				<ScrollView>
					{/* Quiz list */}
					<FlatList
						data={quizzes}
						scrollEnabled={false}
						onRefresh={() => undefined}
						refreshing={refreshing}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item) => item.title}
						renderItem={({ item: quiz, index }) => (
							<View
								style={{
									padding: 20.5,
									borderRadius: 17.5,
									marginVertical: 8.3,
									marginHorizontal: 10,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
									backgroundColor: COLORS.white,
									elevation: 2,
								}}
							>
								<View style={{ flex: 1, paddingRight: 10 }}>
									<Text style={{ fontSize: 19, color: COLORS.black }}>
										{quiz.title}
									</Text>
									<Text
										style={{
											opacity: 0.5,
											marginTop: 5,
											fontSize: 14,
										}}
									>
										{quiz.description}
									</Text>
								</View>
								<TouchableOpacity
									style={{
										paddingVertical: 15,
										paddingHorizontal: 29,
										borderRadius: 35,
										backgroundColor: COLORS.primary,
									}}
									onPress={() => {
										navigation.navigate("Play Quiz page", {
											quizId: quiz.id,
										});
									}}
								>
									<Text
										style={{
											color: COLORS.white,
											fontSize: 18,
											fontWeight: "bold",
										}}
									>
										Play
									</Text>
								</TouchableOpacity>
							</View>
						)}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;

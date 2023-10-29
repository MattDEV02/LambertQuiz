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
import { signOut } from "../utils/auth";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import Quiz from "../components/HomeScreen/Quiz";
import { supabase } from "../app/lib/supabase-client";
import {
	validateObject,
	validateString,
	validateArray,
} from "../utils/validators";

const HomeScreen = ({ navigation }) => {
	const iconsSize = 19,
		iconsPaddingHorizontal = 11.5,
		iconsPaddingVertical = 7;
	const [user, setUser] = useState(null);
	const [quizzes, setQuizzes] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		const getUserFromEmail = async () => {
			setRefreshing(true);
			const {
				data: { user },
			} = await supabase.auth.getUser();
			const email = user.email;
			const { data, error } = await supabase
				.from("users")
				.select("email, username")
				.eq("email", email)
				.single(); // UNIQUE
			if (validateObject(error)) {
				console.error(error);
				setRefreshing(false);
			} else {
				if (validateObject(data)) setUser(data);
				else console.error("Invalid Data!");
				setRefreshing(false);
			}
		};

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

		getUserFromEmail();
		getQuizzes();
	}, []);

	const handleOnPlayPress = (quiz) => {
		navigation.navigate("Play Quiz page", {
			quizId: quiz.quiz_id,
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
								onPress={() =>
									navigation.navigate("Account page", { user })
								}
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
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "right",
							justifyContent: "flex-end",
							marginRight: 13,
						}}
					>
						<Text
							style={{
								fontSize: 21,
								color: COLORS.error,
								fontWeight: "500",
							}}
							onPress={() => signOut()}
						>
							Logout
						</Text>
						<MaterialIcons
							name="arrow-circle-o-left"
							size={iconsSize + 6}
							color={COLORS.error}
							style={{
								marginLeft: 6.5,
								marginTop: 3.5,
							}}
						/>
					</TouchableOpacity>
				</View>
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

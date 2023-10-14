import React from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "../constants/theme";
import FormButton from "../components/shared/FormButton";
import { signOut } from "../utils/auth";

const HomeScreen = ({ navigation }) => {
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
			<View
				style={{
					backgroundColor: COLORS.white,
					flex: 1,
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
			<FormButton
				labelText="Play"
				style={{
					position: "absolute",
					bottom: 20,
					right: 20,
					borderRadius: 50,
					padding: 40,
				}}
				handleOnPress={() => navigation.navigate("Play Quiz page")}
			></FormButton>
		</SafeAreaView>
	);
};

export default HomeScreen;

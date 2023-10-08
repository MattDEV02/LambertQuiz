import React from "react";
import { View, Text, StatusBar } from "react-native";
import { COLORS } from "../constants/theme";
import FormButton from "../components/shared/FormButton";

const HomeScreen = ({ navigation }) => {
	return (
		<View
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
					alignItems: "right", //
					justifyContent: "flex-end",
					backgroundColor: COLORS.white,
					elevation: 5,
					paddingHorizontal: 20,
					paddingBottom: 3.5,
				}}
			>
				<Text
					style={{ fontSize: 21, padding: 10, color: COLORS.error }}
					onPress={() => navigation.navigate("Sign In page")}
				>
					Logout
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
				handleOnPress={() => navigation.navigate("Sign Up page")}
			></FormButton>
		</View>
	);
};

export default HomeScreen;

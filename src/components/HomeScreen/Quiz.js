import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";

const Quiz = ({ quiz, handleOnPlayPress }) => {
	return (
		<View
			style={{
				padding: 20.5,
				borderRadius: 17.5,
				marginVertical: 5.2,
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
					paddingVertical: 13.5,
					paddingHorizontal: 25,
					borderRadius: 34,
					backgroundColor: COLORS.primary,
					borderWidth: 1,
					borderColor: COLORS.black,
				}}
				onPress={handleOnPlayPress}
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
	);
};

export default Quiz;

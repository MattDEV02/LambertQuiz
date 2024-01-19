import React from "react";
import { View, Text } from "react-native";
import FormButton from "../../shared/form/FormButton";
import { COLORS } from "../../../constants/theme";

const Quiz = ({ quiz, handleOnPlayPress }) => {
	return (
		<View
			style={{
				padding: 20.5,
				borderRadius: 17.5,
				marginVertical: 5.1,
				marginHorizontal: 10,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: COLORS.white,
				elevation: 4,
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
			<FormButton
				labelText="Play"
				handleOnPress={() => handleOnPlayPress()}
				style={{
					paddingVertical: 13.5,
					paddingHorizontal: 25,
					borderRadius: 34,
					backgroundColor: COLORS.primary,
					borderWidth: 1,
					borderColor: COLORS.black,
				}}
				textStyle={{
					color: COLORS.white,
				}}
			/>
		</View>
	);
};

export default Quiz;

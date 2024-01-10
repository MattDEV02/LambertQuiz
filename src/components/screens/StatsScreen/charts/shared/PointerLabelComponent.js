import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../../../../constants/theme";

const PointerLabelComponent = ({ value, style = null }) => {
	return (
		<View
			style={{
				width: 100,
				paddingVertical: 6,
				borderWidth: 1,
				borderColor: COLORS.secondary,
				borderRadius: 19,
				backgroundColor: COLORS.grey,
				justifyContent: "center",
				position: "relative",
				zIndex: 1,
				...style
			}}
		>
			<Text style={{ textAlign: "center", fontWeight: "bold" }}>
				{value} { value > 1 ? "Quizzes" : "Quiz" } on this day !
			</Text>
		</View>
	);
};

export default PointerLabelComponent;

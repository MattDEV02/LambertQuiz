import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../../../../constants/theme";

const PointerLabelComponent = ({ value }) => {
	return (
		<View
			style={{
				width: 100,
				paddingVertical: 6,
				borderWidth: 1,
				borderColor: COLORS.secondary,
				borderRadius: 15,
				backgroundColor: COLORS.grey,
				justifyContent: "center",
				position: "relative",
				zIndex: 1,
			}}
		>
			<Text style={{ textAlign: "center", fontWeight: "bold" }}>
				{value} Quizzes on this day !
			</Text>
		</View>
	);
};

export default PointerLabelComponent;

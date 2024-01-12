import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../../constants/theme";

const HelpFooter = () => {
	return (
		<View
			style={{
				paddingHorizontal: 20,
				paddingBottom: 27,
				marginTop: 24,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<View>
				<Text style={{ fontSize: 15, color: COLORS.primary }}>
					For any problems encountered, contact the development center at
					matteolambertucci3@gmail.com
				</Text>
				<Text style={{ color: COLORS.primary, marginTop: 5 }}>
					Copyright © Lambertucci Matteo 2024.
				</Text>
			</View>
		</View>
	);
};

export default HelpFooter;

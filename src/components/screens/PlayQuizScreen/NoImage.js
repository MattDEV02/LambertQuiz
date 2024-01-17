import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { COLORS } from "../../../constants/theme";

const NoImage = () => {
	return (
		<SafeAreaView>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginVertical: 47,
				}}
			>
				<Text
					style={{
						fontSize: 30,
						color: COLORS.black,
						fontWeight: "bold",
					}}
				>
					NO IMAGE
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default NoImage;

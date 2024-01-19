import React from "react";
import { View, Text } from "react-native";
import { SIZES } from "../../constants/theme";

const Offline = () => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginTop: SIZES.width / 2,
			}}
		>
			<Text
				style={{
					color: "#EF0909",
					fontWeight: "bold",
					fontSize: 26,
				}}
			>
				You are offline, you must connect to the Internet first!
			</Text>
		</View>
	);
};

export default Offline;

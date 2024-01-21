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
				Connection not established, perhaps you are offline, try connecting
				to the Internet.
			</Text>
		</View>
	);
};

export default Offline;

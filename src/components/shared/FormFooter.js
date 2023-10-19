import React from "react";
import { View, Text } from "react-native";
import { COLORS, footerFontSize } from "../../constants/theme";

const FormFooter = ({ isLogin = true, handleOnPress }) => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				marginTop: 23,
			}}
		>
			<Text style={{ fontSize: footerFontSize }}>
				{isLogin ? "Don't have an account ?" : "Do you have an account?"}
			</Text>
			<Text
				style={{
					marginLeft: 5,
					color: COLORS.primary,
					fontSize: footerFontSize,
				}}
				onPress={handleOnPress}
			>
				{isLogin ? "Create an account" : "Login to your account"}
			</Text>
		</View>
	);
};

export default FormFooter;

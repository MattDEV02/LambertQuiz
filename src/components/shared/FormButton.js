import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../constants/theme";

const FormButton = ({
	labelText = "",
	handleOnPress = null,
	style,
	isPrimary = true,
	...more
}) => {
	return (
		<TouchableOpacity
			style={{
				paddingVertical: 10,
				backgroundColor: isPrimary ? COLORS.primary : COLORS.white,
				borderWidth: 1,
				borderColor: COLORS.primary,
				borderRadius: 8,
				...style,
			}}
			onPress={() => handleOnPress()}
			{...more}
		>
			<Text
				style={{
					textAlign: "center",
					fontSize: 19,
					fontWeight: "bold",
					color: isPrimary ? COLORS.white : COLORS.primary,
				}}
			>
				{labelText}
			</Text>
		</TouchableOpacity>
	);
};

export default FormButton;

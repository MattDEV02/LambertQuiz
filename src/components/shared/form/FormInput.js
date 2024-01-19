import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { COLORS } from "../../../constants/theme";
import Icon from "react-native-vector-icons/FontAwesome";

const FormInput = ({
	labelText = "",
	placeholderText = "",
	onChangeText = null,
	value = null,
	inputError = false,
	inputSuccess = false,
	isPassword = false,
	style = null,
	inputStyle = null,
	...more
}) => {
	const [showPassword, setShowPassword] = useState(false);

	let textErrorStyle = null,
		textInputErrorStyle = null;
	let textSuccessStyle = null,
		textInputSuccessStyle = null;
	if (inputError) {
		textErrorStyle = {
			color: COLORS.error,
		};
		textInputErrorStyle = {
			borderColor: COLORS.error,
			color: COLORS.error,
		};
	} else if (inputSuccess) {
		textSuccessStyle = {
			color: COLORS.success,
		};
		textInputSuccessStyle = {
			borderColor: COLORS.success,
			color: COLORS.success,
		};
	}

	return (
		<View
			style={{
				...{
					width: "100%",
					marginBottom: 20,
				},
				...style,
			}}
		>
			<Text style={{ ...textErrorStyle, ...textSuccessStyle }}>
				{labelText}
			</Text>
			<View>
				<TextInput
					style={{
						...{
							padding: 10,
							borderColor: COLORS.black + "20",
							borderWidth: 1,
							width: "100%",
							marginTop: 11,
						},
						...inputStyle,
						...textInputErrorStyle,
						...textInputSuccessStyle,
					}}
					placeholder={placeholderText}
					onChangeText={onChangeText}
					value={value}
					secureTextEntry={isPassword && !showPassword}
					{...more}
				/>
				{isPassword ? (
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						style={{ position: "absolute", top: 25, right: 12.5 }}
					>
						<Icon
							name={showPassword ? "eye-slash" : "eye"}
							color={COLORS.primary}
							size={21.5}
						/>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
};

export default FormInput;

import React, { useState } from "react";
import { View, Text } from "react-native";
import { COLORS } from "../constants/theme";
import FormInput from "../components/shared/FormInput";

const SignInScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnSubmit = () => {};
	return (
		<View
			style={{
				backgroundColor: COLORS.white,
				flex: 1,
				alignItems: "center",
				justifyContent: "flex-start",
				padding: 20,
			}}
		>
			<Text
				style={{
					fontSize: 24,
					colors: COLORS.black,
					fontWeight: "bold",
					marginVertical: 32,
				}}
			>
				SignInScreen ok
			</Text>
			<FormInput
				labelText="Email"
				placeholderText="Enter your email"
				onChangeText={(value) => setEmail(value)}
				value={email}
				keyboardType="email-address"
			/>

			<FormInput
				labelText="Password"
				placeholderText="Enter your password"
				onChangeText={(password) => setPassowrd(password)}
				value={password}
				secureTextEntry={true}
				keyboardType="password"
			/>
		</View>
	);
};

export default SignInScreen;

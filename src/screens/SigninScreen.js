import React, { useState } from "react";
import { Text, SafeAreaView, Alert } from "react-native";
import { COLORS, appName } from "../constants/theme";
import { validateEmail, validatePassword } from "../utils/validators.js";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import { signIn } from "../utils/auth";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnPress = () => {
		if (validateEmail(email)) {
			validatePassword(password)
				? signIn(email, password)
				: Alert.alert("Password not valid, use 8 chars.");
		} else Alert.alert("Email not valid.");
	};

	return (
		<SafeAreaView
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
					fontSize: 30,
					color: COLORS.black,
					fontWeight: "bold",
					marginVertical: 25,
				}}
			>
				{appName}
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
				placeholderText="Enter your password (use 8 chars)"
				onChangeText={(password) => setPassword(password)}
				value={password}
				secureTextEntry={true}
			/>
			<FormButton
				labelText="Submit"
				handleOnPress={handleOnPress}
				style={{ width: "100%", marginTop: 4 }}
			/>
			<FormFooter navigation={navigation} />
		</SafeAreaView>
	);
};

export default SignInScreen;

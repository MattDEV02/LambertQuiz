import React, { useState } from "react";
import { Text, SafeAreaView, Alert as Window } from "react-native";
import { COLORS, appName } from "../constants/theme";
import { validateEmail, validatePassword } from "../utils/validators.js";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import { signIn } from "../utils/auth";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleOnPress = () => {
		if (validateEmail(email)) {
			setEmailError(false);
		} else {
			setEmailError(true);
			Window.alert("Email not valid", "Please enter a valid email.");
		}
		if (validatePassword(password)) {
			setPasswordError(false);
		} else {
			setPasswordError(true);
			Window.alert(
				"Password not valid",
				"Password not valid, please use minimum 8 chars and maximum 32 chars.",
			);
		}
		if (validateEmail(email) && validatePassword(password)) {
			signIn(email, password);
			setEmail("");
			setPassword("");
		}
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
				inputError={emailError}
				keyboardType="email-address"
			/>
			<FormInput
				labelText="Password"
				placeholderText="Enter your password"
				onChangeText={(password) => setPassword(password)}
				value={password}
				inputError={passwordError}
				secureTextEntry={true}
			/>
			<FormButton
				labelText="Submit"
				handleOnPress={handleOnPress}
				style={{ width: "100%", marginTop: 4 }}
			/>
			<FormFooter
				handleOnPress={() => navigation.navigate("Sign Up page")}
			/>
		</SafeAreaView>
	);
};

export default SignInScreen;

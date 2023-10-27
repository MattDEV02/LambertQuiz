import React, { useState } from "react";
import { Text, SafeAreaView, Alert } from "react-native";
import { COLORS, appName } from "../constants/theme";
import { validateEmail, validatePassword } from "../utils/validators.js";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import { signIn } from "../utils/auth";
import { existsUser } from "../utils/database";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnPress = () => {
		if (validateEmail(email)) {
			validatePassword(password)
				? signIn(email, password)
				: Alert.alert(
						"Password not valid, use minimum 8 chars and maximum 32 chars.",
				  );
			setEmail("");
			setPassword("");
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
				placeholderText="Enter your password"
				onChangeText={(password) => setPassword(password)}
				value={password}
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

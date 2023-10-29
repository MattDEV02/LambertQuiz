import React, { useState } from "react";
import { Text, SafeAreaView, Alert } from "react-native";
import { COLORS, appName } from "../constants/theme";
import InputScrollView from "react-native-input-scroll-view";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import {
	validateEmail,
	validatePassword,
	validateUsername,
} from "../utils/validators";
import { signUp } from "../utils/auth";

const SignUpScreen = ({ navigation }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleOnPress = () => {
		// TODO: email and userame unique.
		if (validateEmail(email)) {
			if (validateUsername(username)) {
				if (validatePassword(password))
					if (password === confirmPassword) {
						if (signUp(email, password, username))
							navigation.navigate("Sign In page");
					} else Alert.alert("The password did not match.");
				else
					Alert.alert(
						"Password not valid, use minimum 8 chars and maximum 32 chars.",
					);
			} else {
				Alert.alert(
					"Username not valid, minimum 3 chars and maximum 8 chars.",
				);
			}
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
			<InputScrollView>
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
					onChangeText={(email) => setEmail(email)}
					value={email}
					keyboardType="email-address"
				/>
				<FormInput
					labelText="Username"
					placeholderText="Enter your username (between 3 & 8 chars)"
					onChangeText={(username) => setUsername(username)}
					value={username}
				/>
				<FormInput
					labelText="Password"
					placeholderText="Enter your password"
					onChangeText={(password) => setPassword(password)}
					value={password}
					secureTextEntry={true}
				/>
				<FormInput
					labelText="Confirm your Password"
					placeholderText="Confirm your Password"
					onChangeText={(confirmPassword) =>
						setConfirmPassword(confirmPassword)
					}
					value={confirmPassword}
					secureTextEntry={true}
				/>
				<FormButton
					labelText="Submit"
					handleOnPress={handleOnPress}
					style={{ width: "100%", marginTop: 4 }}
				/>
				<FormFooter
					isLogin={false}
					handleOnPress={() => navigation.navigate("Sign In page")}
				/>
			</InputScrollView>
		</SafeAreaView>
	);
};

export default SignUpScreen;

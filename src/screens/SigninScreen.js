import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { COLORS, appName } from "../constants/theme";
import { validateEmail, validatePassword } from "../constants/utils.js";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnPress = () => {
		if (validateEmail(email)) {
			if (validatePassword(password)) {
				// TODO: Login check
				Alert.alert("Login.");
				navigation.navigate("Home page");
			} else Alert.alert("Password not valid, minimum 8 chars.");
		} else Alert.alert("Email not valid.");
	};

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
					fontSize: 30,
					color: COLORS.black,
					fontWeight: "bold",
					marginVertical: 28,
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
		</View>
	);
};

export default SignInScreen;

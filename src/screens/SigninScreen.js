import React, { useState } from "react";
import { View, Text } from "react-native";
import { COLORS } from "../constants/theme";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleOnSubmit = () => {
		if (email != "" && password != "") {
			//ok
		} else {
			// no ok
		}
	};

	const footerFontSize = 15;

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
				Login
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
				handleOnPress={handleOnSubmit}
				style={{ width: "100%", marginTop: 4 }}
			/>
			{/* Footer */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginTop: 22,
				}}
			>
				<Text style={{ fontSize: footerFontSize }}>
					Don't have an account ?
				</Text>
				<Text
					style={{
						marginLeft: 5,
						color: COLORS.primary,
						fontSize: footerFontSize,
					}}
					onPress={() => navigation.navigate("Sign Up page")}
				>
					Create an account
				</Text>
			</View>
		</View>
	);
};

export default SignInScreen;

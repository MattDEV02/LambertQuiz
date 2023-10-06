import React, { useState } from "react";
import { View, Text, SafeAreaView, Alert } from "react-native";
import { COLORS, footerFontSize } from "../constants/theme";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";

const SignUpScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleOnSubmit = () => {
		if (email != "" && password != "") {
			//ok
			if (password == confirmPassword) {
				// ok
			} else {
				Alert.alert("The password did not match.");
			}
		} else {
			// no ok
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
					marginVertical: 28,
				}}
			>
				Register
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
					Do you have already an account ?
				</Text>
				<Text
					style={{
						marginLeft: 5,
						color: COLORS.primary,
						fontSize: footerFontSize,
					}}
					onPress={() => navigation.navigate("Sign In page")}
				>
					Login here
				</Text>
			</View>
		</SafeAreaView>
	);
};

export default SignUpScreen;

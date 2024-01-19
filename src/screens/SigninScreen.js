import React, { useState } from "react";
import { Text, SafeAreaView, Alert as Window } from "react-native";
import FormInput from "../components/shared/form/FormInput.js";
import FormButton from "../components/shared/form/FormButton.js";
import FormFooter from "../components/shared/form/FormFooter.js";
import { signIn } from "../utils/auth";
import { COLORS, appName } from "../constants/theme";
import {
	emailMaxLength,
	passwordMaxLength,
} from "../constants/fieldsConstants";
import { validateEmail, validatePassword } from "../utils/validators.js";

const SignInScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [emailSuccess, setEmailSuccess] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState(false);

	const fieldsReset = () => {
		setEmail("");
		setPassword("");
		setEmailError(false);
		setEmailSuccess(false);
		setPasswordError(false);
		setPasswordSuccess(false);
	};

	const emailFieldError = () => {
		setEmailError(true);
		setEmailSuccess(false);
	};

	const emailFieldSuccess = () => {
		setEmailError(false);
		setEmailSuccess(true);
	};

	const passwordFieldError = () => {
		setPasswordError(true);
		setPasswordSuccess(false);
	};

	const passwordFieldSuccess = () => {
		setPasswordError(false);
		setPasswordSuccess(true);
	};

	const handleOnPress = async () => {
		if (validateEmail(email)) {
			emailFieldSuccess();
		} else {
			emailFieldError();
			Window.alert("Email not valid", "Please enter a valid email.");
		}
		if (validatePassword(password)) {
			passwordFieldSuccess();
		} else {
			passwordFieldError();
			Window.alert(
				"Password not valid",
				`Password not valid, use minimum ${passwordMaxLength} chars with numbers, lowercase and uppercase letters.`,
			);
		}
		if (validateEmail(email) && validatePassword(password)) {
			const signInResult = await signIn(email, password);
			console.log("signInResult", signInResult);
			if (signInResult) {
				emailFieldSuccess();
				passwordFieldSuccess();
			} else {
				emailFieldError();
				passwordFieldError();
			}
			fieldsReset();
		}
	};

	navigation.addListener("blur", () => {
		fieldsReset();
	});

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
				labelText={"Email"}
				placeholderText={"Enter your email"}
				value={email}
				inputError={emailError}
				inputSuccess={emailSuccess}
				keyboardType={"email-address"}
				autoComplete={"off"}
				autoCorrect={false}
				maxLength={emailMaxLength}
				autocapitalize={"none"}
				spellcheck={false}
				inputMode={"email"}
				onChangeText={(value) => setEmail(value)}
				onEndEditing={(event) =>
					setEmail(event.nativeEvent.text.toLowerCase())
				}
			/>
			<FormInput
				labelText={"Password"}
				placeholderText={`Enter your password (${passwordMaxLength} chars)`}
				value={password}
				inputError={passwordError}
				inputSuccess={passwordSuccess}
				isPassword={true}
				autoComplete={"off"}
				autoCorrect={false}
				maxLength={passwordMaxLength}
				onChangeText={(password) => setPassword(password)}
			/>
			<FormButton
				labelText={"Submit"}
				handleOnPress={() => handleOnPress()}
				style={{ width: "100%", marginTop: 4, borderRadius: 13 }}
				textStyle={{ color: COLORS.white, fontSize: 21 }}
			/>
			<FormFooter
				handleOnPress={() => navigation.navigate("Sign Up page")}
			/>
		</SafeAreaView>
	);
};

export default SignInScreen;

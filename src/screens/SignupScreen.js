import React, { useState, useEffect } from "react";
import {
	Text,
	SafeAreaView,
	View,
	Alert as Window,
	StatusBar,
} from "react-native";
import { supabase } from "../app/lib/supabase-client";
import InputScrollView from "react-native-input-scroll-view";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import {
	validateEmail,
	validatePassword,
	validateConfirmPassword,
	validateUsername,
	validateObject,
	validateArray,
} from "../utils/validators";
import { signUp } from "../utils/auth";
import { COLORS, appName } from "../constants/theme";
import {
	emailMaxLength,
	passwordMaxLength,
	usernameMaxLength,
} from "../constants/fieldsConstants";

const SignUpScreen = ({ navigation }) => {
	const [users, setUsers] = useState([]);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const [emailSuccess, setEmailSuccess] = useState(false);
	const [usernameSuccess, setUsernameSuccess] = useState(false);
	const [passwordSuccess, setPasswordSuccess] = useState(false);
	const [confirmPasswordSuccess, setConfirmPasswordSuccess] = useState(false);

	useEffect(() => {
		const getUsersEmailAndUsername = async () => {
			const { data, error } = await supabase
				.from("users")
				.select("email, username");
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				setUsers(data);
			}
		};
		getUsersEmailAndUsername();
	}, []);

	const getEmailsFromUsers = (users) => {
		let emails = [];
		if (validateArray(users, 0)) {
			users.map((user) => {
				if (validateObject(user) && validateEmail(user.email))
					emails.push(user.email);
			});
		}
		return emails;
	};

	const getUsernamesFromUsers = (users) => {
		let usernames = [];
		if (validateArray(users, 0)) {
			users.map((user) => {
				if (validateObject(user) && validateUsername(user.username))
					usernames.push(user.username);
			});
		}
		return usernames;
	};

	const fieldsReset = () => {
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setUsername("");
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

	const confirmPasswordFieldError = () => {
		setConfirmPasswordError(true);
		setConfirmPasswordSuccess(false);
	};

	const confirmPasswordFieldSuccess = () => {
		setConfirmPasswordError(false);
		setConfirmPasswordSuccess(true);
	};

	const usernameFieldError = () => {
		setUsernameError(true);
		setUsernameSuccess(false);
	};

	const usernameFieldSuccess = () => {
		setUsernameError(false);
		setUsernameSuccess(true);
	};

	const handleOnPress = () => {
		if (validateEmail(email)) {
			emailFieldSuccess();
		} else {
			emailFieldError();
			Window.alert("Email not valid.", "Please enter a valid email.");
		}
		if (validateUsername(username)) {
			usernameFieldSuccess();
		} else {
			Window.alert(
				`Username ${username} not valid`,
				"Username not valid, minimum 3 chars and maximum 10 chars.",
			);
			usernameFieldError();
		}
		if (validatePassword(password)) {
			passwordFieldSuccess();
		} else {
			passwordFieldError();
			Window.alert(
				"Password not valid",
				"Password not valid, use minimum 8 chars with numbers, lowercase and uppercase letters.",
			);
		}
		if (validateConfirmPassword(confirmPassword)) {
			confirmPasswordFieldSuccess();
		} else {
			confirmPasswordFieldError();
			Window.alert("Please, try again", "The passwords did not match or Password not valid.");
		}
		if (
			validateEmail(email) &&
			validateUsername(username) &&
			validatePassword(password)
		) {
			if (password === confirmPassword) {
				const emails = getEmailsFromUsers(users),
					usernames = getUsernamesFromUsers(users);
				if (emails.includes(email))
					Window.alert(
						"This email is already used.",
						"Please use another email.",
					);
				else if (usernames.includes(username))
					Window.alert(
						"This username is already used.",
						"Please use another email.",
					);
				else if (signUp(email, password, username)) {
					navigation.navigate("Sign In page");
					fieldsReset();
				}
			} else Window.alert("The password did not match.");
		}
	};

	return (
		<SafeAreaView
			style={{
				backgroundColor: COLORS.white,
				flex: 1,
				alignItems: "center",
				justifyContent: "flex-start",
				padding: 11,
			}}
		>
			<StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
			<InputScrollView>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
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
				</View>
				<FormInput
					labelText="Email"
					placeholderText="Enter your email"
					value={email}
					inputError={emailError}
					inputSuccess={emailSuccess}
					keyboardType="email-address"
					autoComplete={"off"}
					autoCorrect={false}
					maxLength={emailMaxLength}
					autocapitalize={"none"}
					spellcheck={false}
					inputMode={"email"}
					onChangeText={(email) => setEmail(email)}
					onEndEditing={(event) =>
						setEmail(event.nativeEvent.text.toLowerCase())
					}
				/>
				<FormInput
					labelText="Username"
					placeholderText="Enter your username (between 3 & 10 chars)"
					inputError={usernameError}
					inputSuccess={usernameSuccess}
					value={username}
					maxLength={usernameMaxLength}
					autoComplete={"username"}
					autoCorrect={true}
					inputMode={"text"}
					keyboardType={"default"}
					onChangeText={(username) => setUsername(username)}
				/>
				<FormInput
					labelText="Password"
					placeholderText="Enter your password (8 chars)"
					value={password}
					inputError={passwordError}
					inputSuccess={passwordSuccess}
					autoComplete={"off"}
					autoCorrect={false}
					maxLength={passwordMaxLength}
					secureTextEntry={true}
					onChangeText={(password) => setPassword(password)}
				/>
				<FormInput
					labelText="Confirm your Password"
					placeholderText="Confirm your Password"
					value={confirmPassword}
					inputError={confirmPasswordError}
					inputSuccess={confirmPasswordSuccess}
					autoComplete={"off"}
					autoCorrect={false}
					maxLength={passwordMaxLength}
					secureTextEntry={true}
					onChangeText={(confirmPassword) =>
						setConfirmPassword(confirmPassword)
					}
				/>
				<FormButton
					labelText="Submit"
					handleOnPress={() => handleOnPress()}
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

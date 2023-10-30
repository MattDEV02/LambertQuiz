import React, { useState, useEffect } from "react";
import {
	Text,
	SafeAreaView,
	View,
	Alert as Window,
	StatusBar,
} from "react-native";
import { COLORS, appName } from "../constants/theme";
import InputScrollView from "react-native-input-scroll-view";
import FormInput from "../components/shared/FormInput";
import FormButton from "../components/shared/FormButton";
import FormFooter from "../components/shared/FormFooter";
import {
	validateEmail,
	validatePassword,
	validateUsername,
	validateObject,
	validateArray,
	validateString,
} from "../utils/validators";
import { signUp } from "../utils/auth";
import { supabase } from "../app/lib/supabase-client";

const SignUpScreen = ({ navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [users, setUsers] = useState([]);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [usernameError, setUsernameError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);

	useEffect(() => {
		const getUsersEmailAndUsername = async () => {
			setRefreshing(true);
			const { data, error } = await supabase
				.from("users")
				.select("email, username");
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				setUsers(data);
				setRefreshing(false);
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

	const handleOnPress = () => {
		if (validateEmail(email)) {
			setEmailError(false);
		} else {
			setEmailError(true);
			Window.alert("Email not valid.", "Please enter a valid email.");
		}
		if (validateUsername(username)) {
			setUsernameError(false);
		} else {
			Window.alert(
				"Username not valid",
				"Username not valid, minimum 3 chars and maximum 8 chars.",
			);
			setUsernameError(true);
		}
		if (validatePassword(password)) {
			setPasswordError(false);
		} else {
			setPasswordError(true);
			Window.alert(
				"Password not valid",
				"Password not valid, use minimum 8 chars and maximum 32 chars.",
			);
		}
		if (validatePassword(confirmPassword) && confirmPassword === password) {
			setConfirmPasswordError(false);
		} else {
			setConfirmPasswordError(true);
			Window.alert("The password did not match.");
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
				else if (signUp(email, password, username))
					navigation.navigate("Sign In page");
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
					onChangeText={(email) => setEmail(email)}
					value={email}
					inputError={emailError}
					keyboardType="email-address"
				/>
				<FormInput
					labelText="Username"
					placeholderText="Enter your username (between 3 & 8 chars)"
					onChangeText={(username) => setUsername(username)}
					inputError={usernameError}
					value={username}
				/>
				<FormInput
					labelText="Password"
					placeholderText="Enter your password"
					onChangeText={(password) => setPassword(password)}
					value={password}
					inputError={passwordError}
					secureTextEntry={true}
				/>
				<FormInput
					labelText="Confirm your Password"
					placeholderText="Confirm your Password"
					onChangeText={(confirmPassword) =>
						setConfirmPassword(confirmPassword)
					}
					value={confirmPassword}
					inputError={confirmPasswordError}
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

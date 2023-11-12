import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	Alert as Window,
} from "react-native";
import { COLORS } from "../../constants/theme";
import FormInput from "../shared/FormInput";
import { updateUserUsername } from "../../utils/database";
import {
	validateUsername,
	validateArray,
	validateObject,
} from "../../utils/validators";
import { supabase } from "../../app/lib/supabase-client";

const SetUsernameModal = ({
	isModalVisible = false,
	setIsModalVisible,
	oldUsername,
	setUsername,
}) => {
	const [newUsername, setNewUsername] = useState(oldUsername);
	const [usernameError, setUsernameError] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [usersUsername, setUsersUsername] = useState([]);

	useEffect(() => {
		const getUsersUsername = async () => {
			setRefreshing(true);
			const { data, error } = await supabase
				.from("users")
				.select("username");
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				let tempUsersUsername = getUsernamesFromUsers(data);
				setUsersUsername(tempUsersUsername);
				setUsersUsername(
					usersUsername.splice(usersUsername.indexOf(oldUsername), 1),
				);
				setRefreshing(false);
			}
		};
		getUsersUsername();
	}, []);

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
		if (validateUsername(newUsername)) {
			if (!usersUsername.includes(newUsername)) {
				if (oldUsername !== newUsername) {
					Window.alert(
						"Are your sure?",
						`Are you sure you want to set your username in ${newUsername} ?`,
						[
							{
								text: "Yes",
								onPress: () => {
									if (updateUserUsername(oldUsername, newUsername)) {
										setUsername(newUsername);
										setUsernameError(false);
										Window.alert(
											"Username updated",
											`Now your username is ${newUsername}.`,
										);
									}
									setIsModalVisible(false);
								},
							},
							{
								text: "No",
								onPress: () => {
									Window.alert(
										"Username not updated",
										`Your username is still ${oldUsername}.`,
									);
									setIsModalVisible(false);
								},
							},
						],
					);
				} else
					Window.alert(
						"Old and new username are equals",
						"Please, choose a new usermame.",
					);
			} else
				Window.alert(
					"Username already used",
					"Please, choose a new usermame.",
				);
		} else {
			Window.alert(
				`Username ${newUsername} not valid.`,
				"Username not valid, minimum 3 chars and maximum 10 chars.",
			);
			setUsernameError(true);
		}
	};

	return (
		<Modal
			animationType={"slide"}
			transparent={true}
			visible={isModalVisible}
			onRequestClose={() => setIsModalVisible(false)}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: COLORS.black + "90",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						backgroundColor: COLORS.white,
						width: "85%",
						borderRadius: 5,
						padding: 40,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							fontSize: 24,
							color: COLORS.black,
							marginBottom: 30,
						}}
					>
						Set your username
					</Text>
					<FormInput
						labelText="Username"
						placeholderText="Enter your new username"
						inputError={usernameError}
						value={newUsername}
						maxLength={10}
						autoComplete={"username"}
						autoCorrect={true}
						inputMode={"text"}
						keyboardType={"default"}
						onChangeText={(username) => setNewUsername(username)}
					/>
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 11,
							width: "100%",
							backgroundColor: COLORS.primary,
							marginTop: 15,
							borderRadius: 40,
						}}
						onPress={() => handleOnPress()}
					>
						<Text
							style={{
								textAlign: "center",
								color: COLORS.white,
								marginLeft: 10,
								fontSize: 19,
								fontWeight: "500",
							}}
						>
							Submit
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

export default SetUsernameModal;

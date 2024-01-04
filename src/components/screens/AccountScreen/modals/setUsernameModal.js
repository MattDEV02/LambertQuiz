import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Modal,
	Alert as Window,
	StyleSheet
} from "react-native";
import { supabase } from "../../../../app/lib/supabase-client";
import FormInput from "../../../shared/FormInput";
import FormButton from "../../../shared/FormButton";
import { COLORS } from "../../../../constants/theme";
import { usernameMaxLength } from "../../../../constants/fieldsConstants";
import { updateUserUsername } from "../../../../utils/database";
import {
	validateUsername,
	validateArray,
	validateObject,
} from "../../../../utils/validators";

const SetUsernameModal = ({
	isModalVisible = false,
	setIsModalVisible,
	oldUsername,
	setUsername,
}) => {
	const [newUsername, setNewUsername] = useState(oldUsername);
	const [usernameError, setUsernameError] = useState(false);
	const [usernameSuccess, setUsernameSuccess] = useState(false);
	const [usersUsername, setUsersUsername] = useState([]);

	useEffect(() => {
		const getUsersUsernames = async () => {
			const { data, error } = await supabase
				.from("users")
				.select("username");
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				let tempUsersUsername = data.map(value => value.username);
				setUsersUsername(
					tempUsersUsername.splice(tempUsersUsername.indexOf(oldUsername), 1),
				);
			}
		};
		getUsersUsernames();
	}, []);

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
										setUsernameSuccess(true);
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
				} else {
					Window.alert(
						"Old and new username are equals",
						"Please, choose a new usermame.",
					);
				}
			} else {
				Window.alert(
					"Username already used",
					"Please, choose a new usermame.",
				);
			}
		} else {
			Window.alert(
				`Username ${newUsername} not valid.`,
				"Username not valid, minimum 3 chars and maximum 10 chars.",
			);
			setUsernameError(true);
			setUsernameSuccess(false);
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
					...style.centeredContainer,
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
						inputSuccess={usernameSuccess}
						value={newUsername}
						maxLength={usernameMaxLength}
						autoComplete={"username"}
						autoCorrect={true}
						inputMode={"text"}
						keyboardType={"default"}
						onChangeText={(username) => setNewUsername(username)}
					/>
					<FormButton
						labelText="Submit"
						handleOnPress={() => handleOnPress()}
						style={{
							...style.centeredContainer,
							paddingVertical: 11,
							width: "100%",
							backgroundColor: COLORS.primary,
							marginTop: 12,
							borderRadius: 40,
						}}
					/>
				</View>
			</View>
		</Modal>
	);
};

const style = StyleSheet.create({
	centeredContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default SetUsernameModal;

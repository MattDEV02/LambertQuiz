import React, { useState, useEffect } from "react";
import { View, Text, Modal, Alert as Window, StyleSheet } from "react-native";
import { supabase } from "../../../../app/lib/supabase-client";
import FormInput from "../../../shared/form/FormInput";
import FormButton from "../../../shared/form/FormButton";
import { COLORS } from "../../../../constants/theme";
import { usernameMaxLength } from "../../../../constants/fieldsConstants";
import { updateUserUsername } from "../../../../utils/database";
import { validateUsername, validateObject } from "../../../../utils/validators";
import { sendEmailForUsernameChanged } from "../../../../utils/mailers";

const SetUsernameModal = ({
	isModalVisible = false,
	setIsModalVisible,
	user,
	setUserUsername,
}) => {
	const username = user.username;
	const [oldUsername, setOldUsername] = useState(username);
	const [newUsername, setNewUsername] = useState(username);
	const [usernameError, setUsernameError] = useState(false);
	const [usernameSuccess, setUsernameSuccess] = useState(false);
	const [usernameUpdated, setUsernameUpdated] = useState(false);
	const [usersUsername, setUsersUsername] = useState([]);

	const getUsersUsernames = async () => {
		const { data, error } = await supabase.from("users").select("username");
		if (validateObject(error)) {
			console.error(error);
		} else if (validateObject(data)) {
			let tempUsersUsername = data.map((value) => value.username);
			tempUsersUsername = tempUsersUsername.filter(
				(username) => username !== oldUsername,
			);
			setUsersUsername(tempUsersUsername);
		}
	};

	useEffect(() => {
		getUsersUsernames();
	}, [usernameUpdated]);

	const fieldsReset = () => {
		setUsernameError(false);
		setUsernameSuccess(false);
		setIsModalVisible(false);
	};

	const handleOnPress = () => {
		if (validateUsername(newUsername)) {
			if (!usersUsername.includes(newUsername)) {
				if (oldUsername !== newUsername) {
					setUsernameError(false);
					setUsernameSuccess(true);
					Window.alert(
						"Are your sure?",
						`Are you sure you want to set your username in ${newUsername} ?`,
						[
							{
								text: "Yes",
								onPress: () => {
									if (updateUserUsername(oldUsername, newUsername)) {
										setOldUsername(newUsername);
										setUserUsername({
											user: {
												...user,
												username: newUsername,
											},
										});
										setUsernameUpdated(true);
										Window.alert(
											"Username updated",
											`Now your username is ${newUsername}.`,
										);
										sendEmailForUsernameChanged(user, newUsername);
									}
								},
							},
							{
								text: "No",
								onPress: () => {
									Window.alert(
										"Username not updated",
										`Your username is still ${oldUsername}.`,
									);
									setNewUsername(oldUsername);
								},
							},
						],
					);
					fieldsReset();
				} else {
					Window.alert(
						"Please, choose another usermame",
						`Old and new username (${newUsername}) are equals.`,
					);
					setUsernameError(true);
					setUsernameSuccess(false);
				}
			} else {
				Window.alert(
					"Please, choose another usermame",
					`Username ${newUsername} is already used.`,
				);
				setUsernameError(true);
				setUsernameSuccess(false);
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
							fontSize: 25,
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
						textStyle={{
							color: COLORS.white,
							fontSize: 20,
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

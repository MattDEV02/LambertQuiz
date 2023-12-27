import React, { useState } from "react";
import { View, Text, Modal, Alert as Window, StyleSheet } from "react-native";
import FormInput from "../../shared/FormInput";
import FormButton from "../../shared/FormButton";
import { COLORS } from "../../../constants/theme";
import { passwordMaxLength } from "../../../constants/fieldsConstants";
import { validatePassword } from "../../../utils/validators";
import { updateUserPassword } from "../../../utils/database";

const SetPasswordModal = ({
	isModalVisible = false,
	setIsModalVisible,
	username,
}) => {
	const [newPassword, setNewPassword] = useState("");
	const [newConfirmPassword, setNewConfirmPassword] = useState("");
	const [newPasswordError, setNewPasswordError] = useState(false);
	const [confirmpasswordError, setConfirmPasswordError] = useState(false);
	const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
	const [confirmpasswordSuccess, setConfirmPasswordSuccess] = useState(false);

	const handleOnPress = () => {
		if (validatePassword(newPassword)) {
			if (newPassword === newConfirmPassword) {
				setConfirmPasswordError(false);
				setConfirmPasswordSuccess(true);
				Window.alert(
					"Are your sure?",
					"Are you sure you want to set your password ?",
					[
						{
							text: "Yes",
							onPress: () => {
								if (updateUserPassword(username, newPassword)) {
									setNewPasswordError(false);
									setNewPasswordSuccess(true);
									Window.alert(
										"We have sented an email confirmation to you.",
										"Please check your email checkbox.",
									);
								}
								setIsModalVisible(false);
							},
						},
						{
							text: "No",
							onPress: () => {
								Window.alert("Password not updated");
								setIsModalVisible(false);
							},
						},
					],
				);
			} else {
				setConfirmPasswordError(true);
				setConfirmPasswordSuccess(false);
				Window.alert("Please, try again.", "The passwords did not match.");
			}
		} else {
			Window.alert(
				`Password not valid.`,
				"Password not valid, use minimum 8 chars with numbers, lowercase and uppercase letters.",
			);
			setNewPasswordError(true);
			setNewPasswordSuccess(false);
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
					...style.centeredContainer
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
						Set your password
					</Text>
					<FormInput
						labelText="New Password"
						placeholderText="Enter your new password (8 chars)"
						value={newPassword}
						inputError={newPasswordError}
						inputSuccess={newPasswordSuccess}
						autoComplete={"off"}
						autoCorrect={false}
						maxLength={passwordMaxLength}
						secureTextEntry={true}
						onChangeText={(password) => setNewPassword(password)}
					/>
					<FormInput
						labelText="Confirm new Password"
						placeholderText="Confirm your new Password"
						value={newConfirmPassword}
						inputError={confirmpasswordError}
						inputSuccess={confirmpasswordSuccess}
						autoComplete={"off"}
						autoCorrect={false}
						maxLength={passwordMaxLength}
						secureTextEntry={true}
						onChangeText={(confirmPassword) =>
							setNewConfirmPassword(confirmPassword)
						}
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

export default SetPasswordModal;

import React, { useState } from "react";
import { View, Text, Modal, Alert as Window, StyleSheet } from "react-native";
import { supabase } from "../../../../app/lib/supabase-client";
import FormInput from "../../../shared/FormInput";
import FormButton from "../../../shared/FormButton";
import { COLORS } from "../../../../constants/theme";
import { passwordMaxLength } from "../../../../constants/fieldsConstants";
import {
	validatePassword,
	validateConfirmPassword,
	validateObject,
	validateBoolean,
} from "../../../../utils/validators";
import { updateUserPassword } from "../../../../utils/database";

const SetPasswordModal = ({
	isModalVisible = false,
	setIsModalVisible,
	username,
}) => {
	const [oldPassword, setOldPassword] = useState("");
	const [oldPasswordError, setOldPasswordError] = useState(false);
	const [oldPasswordSuccess, setOldPasswordSuccess] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [newConfirmPassword, setNewConfirmPassword] = useState("");
	const [newPasswordError, setNewPasswordError] = useState(false);
	const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
	const [confirmpasswordError, setConfirmPasswordError] = useState(false);
	const [confirmpasswordSuccess, setConfirmPasswordSuccess] = useState(false);

	const fieldsReset = () => {
		setIsModalVisible(false);
		setOldPassword("");
		setNewPassword("");
		setNewConfirmPassword("");
		setOldPasswordError(false);
		setOldPasswordSuccess(false);
		setNewPasswordError(false);
		setNewPasswordSuccess(false);
		setConfirmPasswordError(false);
		setConfirmPasswordSuccess(false);
	};

	const handleOnPress = async () => {
		if (validatePassword(oldPassword)) {
			setOldPasswordError(false);
			setOldPasswordSuccess(true);
		} else {
			setOldPasswordError(true);
			setOldPasswordSuccess(false);
		}
		if (validatePassword(newPassword)) {
			setNewPasswordError(false);
			setNewPasswordSuccess(true);
		} else {
			Window.alert(
				`Password not valid.`,
				"Password not valid, use 8 chars with numbers, lowercase and uppercase letters.",
			);
			setNewPasswordError(true);
			setNewPasswordSuccess(false);
		}
		if (validateConfirmPassword(newPassword, newConfirmPassword)) {
			setConfirmPasswordError(false);
			setConfirmPasswordSuccess(true);
		} else {
			setConfirmPasswordError(true);
			setConfirmPasswordSuccess(false);
			Window.alert(
				"Please, try again.",
				"The new password did not match with confirm password or it is not valid.",
			);
		}
		if (
			validatePassword(oldPassword) &&
			validatePassword(newPassword) &&
			validateConfirmPassword(newPassword, newConfirmPassword)
		) {
			const { data, error } = await supabase.rpc(
				"check_user_password_function",
				{
					input_username: username,
					input_password: oldPassword,
				},
			);
			if (validateObject(error)) {
				console.error(error);
			} else if (validateBoolean(data) && data === true) {
				console.log(data);
				if (oldPassword !== newPassword) {
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
											"Password updated",
											"Password updated with success.",
										);
									}
								},
							},
							{
								text: "No",
								onPress: () => {
									Window.alert(
										"Password not updated",
										"Your password is still the same.",
									);
								},
							},
						],
					);
					fieldsReset();
				} else {
					setNewPasswordError(true);
					setNewPasswordSuccess(false);
					setConfirmPasswordError(true);
					setConfirmPasswordSuccess(false);
					Window.alert(
						"Old Password and new password are equals",
						"Please, choose another new password.",
					);
				}
			} else {
				setOldPasswordError(true);
				setOldPasswordSuccess(false);
				Window.alert(
					"Old Password does not match.",
					"Please, retry with the old password.",
				);
			}
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
						Set your password
					</Text>
					<FormInput
						labelText="Old password"
						placeholderText="Enter your old password (8 chars)"
						value={oldPassword}
						inputError={oldPasswordError}
						inputSuccess={oldPasswordSuccess}
						autoComplete={"off"}
						autoCorrect={false}
						maxLength={passwordMaxLength}
						secureTextEntry={true}
						onChangeText={(password) => setOldPassword(password)}
					/>
					<FormInput
						labelText="New password"
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
						labelText="Confirm new password"
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
						textStyle={{
							color: COLORS.white,
							fontSize: 20.5,
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

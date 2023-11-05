import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	Alert as Window,
} from "react-native";
import { COLORS } from "../../constants/theme";
import FormInput from "../shared/FormInput";
import { validatePassword } from "../../utils/validators";
import { updateUserPassword } from "../../utils/database";

const SetPasswordModal = ({
	isModalVisible = false,
	setIsModalVisible,
	oldPassword,
	username,
}) => {
	const [newPassword, setNewPassword] = useState("");
	const [passwordError, setPasswordError] = useState(false);
	const [newConfirmPassword, setNewConfirmPassword] = useState("");
	const [confirmpasswordError, setConfirmPasswordError] = useState(false);

	const handleOnPress = () => {
		if (validatePassword(newPassword)) {
			if (newPassword === newConfirmPassword) {
				setConfirmPasswordError(false);
				if (oldPassword !== newPassword) {
					Window.alert(
						"Are your sure?",
						"Are you sure you want to set your password ?",
						[
							{
								text: "Yes",
								onPress: () => {
									if (updateUserPassword(username, newPassword)) {
										setPasswordError(false);
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
				} else
					Window.alert(
						"Old and new password are equals.",
						"Please, choose a new password.",
					);
			} else {
				setConfirmPasswordError(true);
				Window.alert("Please, try again.", "The passwords did not match.");
			}
		} else {
			Window.alert(
				`Password not valid.`,
				"Password not valid, minimum 8 chars and maximum 32 chars.",
			);
			setPasswordError(true);
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
						Set your password
					</Text>
					<FormInput
						labelText="Password"
						placeholderText="Enter your password"
						value={newPassword}
						inputError={passwordError}
						autoComplete={"off"}
						autoCorrect={false}
						maxLength={32}
						secureTextEntry={true}
						onChangeText={(password) => setNewPassword(password)}
					/>
					<FormInput
						labelText="Confirm your Password"
						placeholderText="Confirm your Password"
						value={newConfirmPassword}
						inputError={confirmpasswordError}
						autoComplete={"off"}
						autoCorrect={false}
						maxLength={32}
						secureTextEntry={true}
						onChangeText={(confirmPassword) =>
							setNewConfirmPassword(confirmPassword)
						}
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

export default SetPasswordModal;

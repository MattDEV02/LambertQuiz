import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Logo from "../components/screens/AccountScreen/Logo";
import AccountOption from "../components/screens/AccountScreen/AccountOption";
import SetUsernameModal from "../components/screens/AccountScreen/modals/setUsernameModal";
import SetPasswordModal from "../components/screens/AccountScreen/modals/setPasswordModal";
import { validateObject, validateString } from "../utils/validators";
import { removeUser } from "../utils/auth";
import { COLORS, ACCOUNTOPTIONS } from "../constants/theme";

const AccountScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const [isSetUsernameModalVisible, setIsSetUsernameModalVisible] =
		useState(false);
	const [isSetPasswordModalVisible, setIsSetPasswordModalVisible] =
		useState(false);

	return validateObject(user) &&
		validateString(user.username) &&
		validateString(user.email) ? (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
			}}
		>
			<View style={style.container}>
				{/* LOGO */}
				<Logo />
				<View
					style={{
						...style.container,
						marginTop: 13,
						marginBottom: 5,
					}}
				>
					<Text
						style={{
							color: COLORS.black,
							fontWeight: "bold",
							fontSize: 29,
						}}
					>
						{user.username}
					</Text>
					<Text
						style={{
							color: COLORS.secondary,
							marginTop: 7,
							fontSize: 15,
						}}
					>
						{user.email}
					</Text>
				</View>
				<View style={{ marginBottom: 150 }}>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.setUsername}
						handleOnSetUsernamePress={() =>
							setIsSetUsernameModalVisible(true)
						}
					/>
					<SetUsernameModal
						isModalVisible={isSetUsernameModalVisible}
						setIsModalVisible={setIsSetUsernameModalVisible}
						user={user}
						setUserUsername={navigation.setParams}
					/>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.setPassword}
						handleOnSetPasswordPress={() =>
							setIsSetPasswordModalVisible(true)
						}
					/>
					<SetPasswordModal
						isModalVisible={isSetPasswordModalVisible}
						setIsModalVisible={setIsSetPasswordModalVisible}
						username={user.username}
					/>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.statsPage}
						handleOnStatsPagePress={() =>
							navigation.navigate("Stats page")
						}
					/>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.deleteAccount}
						handleOnDeleteUserPress={() => removeUser(user)}
					/>
				</View>
			</View>
		</SafeAreaView>
	) : null;
};

const style = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default AccountScreen;

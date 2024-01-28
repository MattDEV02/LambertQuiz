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
	const user = route.params.user,
		setUser = route.params.setUser;
	const [username, setUsername] = useState(user.username);
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
			{/* LOGO */}
			<View style={{ ...styles.container, marginTop: 39 }}>
				<Logo />
				<Text
					style={{
						color: COLORS.black,
						fontWeight: "bold",
						fontSize: 30,
						marginTop: 35,
					}}
				>
					{username}
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
			<View style={{ marginTop: 32.5 }}>
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
					setUser={setUser}
					setUsername={setUsername}
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
					user={user}
				/>
				<AccountOption
					accountOption={ACCOUNTOPTIONS.statsPage}
					handleOnStatsPagePress={() => navigation.navigate("Stats page")}
				/>
				<AccountOption
					accountOption={ACCOUNTOPTIONS.deleteAccount}
					handleOnDeleteUserPress={() => removeUser(user)}
				/>
			</View>
		</SafeAreaView>
	) : null;
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
});

export default AccountScreen;

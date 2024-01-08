import React, { useState } from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	Text,
	Image,
} from "react-native";
import AccountOption from "../components/screens/AccountScreen/AccountOption";
import SetUsernameModal from "../components/screens/AccountScreen/modals/setUsernameModal";
import SetPasswordModal from "../components/screens/AccountScreen/modals/setPasswordModal";
import { validateObject, validateString } from "../utils/validators";
import { removeUser } from "../utils/auth";
import { COLORS, ACCOUNTOPTIONS } from "../constants/theme";

// TODO: AccountOption component

const AccountScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const [username, setUsername] = useState(user.username);
	const [isSetUsernameModalVisible, setIsSetUsernameModalVisible] =
		useState(false);
	const [isSetPasswordModalVisible, setIsSetPasswordModalVisible] =
		useState(false);

	return validateObject(user) ? (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
			}}
		>
			<View style={style.container}>
				{/* LOGO */}
				<Image
					source={require("../../assets/images/logo.png")}
					resizeMode={"contain"}
					alt={"Logo"}
					style={{
						width: "35%",
						height: "21.5%",
						marginTop: 35,
					}}
				/>
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
						{validateString(username) ? username : null}
					</Text>
					<Text
						style={{
							color: COLORS.secondary,
							marginTop: 7,
							fontSize: 15,
						}}
					>
						{validateString(user.email) ? user.email : null}
					</Text>
				</View>
				<View style={{ marginBottom: 150 }}>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.setUsername}
						handleOnSetUsernamePress={() => setIsSetUsernameModalVisible(true)}
					/>
					<SetUsernameModal
						isModalVisible={isSetUsernameModalVisible}
						setIsModalVisible={setIsSetUsernameModalVisible}
						oldUsername={username}
						setUsername={setUsername}
					/>
					<AccountOption
						accountOption={ACCOUNTOPTIONS.setPassword}
						handleOnSetPasswordPress={() => setIsSetPasswordModalVisible(true)}
					/>
					<SetPasswordModal
						isModalVisible={isSetPasswordModalVisible}
						setIsModalVisible={setIsSetPasswordModalVisible}
						username={username}
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

import React, { useState } from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../constants/theme";
import SetUsernameModal from "../components/AccountScreen/setUsernameModal";
import SetPasswordModal from "../components/AccountScreen/setPasswordModal";
import { validateObject } from "../utils/validators";

// TODO: AccountOption component

const AccountScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const [username, setUsername] = useState(user.username);
	const [isSetUsernameModalVisible, setIsSetUsernameModalVisible] =
		useState(false);
	const [isSetPasswordModalVisible, setIsSetPasswordModalVisible] =
		useState(false);
	const iconsSize = 26;

	return validateObject(user) ? (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: COLORS.background,
			}}
		>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Image
					source={{ uri: "https://source.unsplash.com/random" }}
					resizeMode={"contain"}
					style={{
						width: "33.33%",
						height: 135,
						marginTop: 40,
						borderRadius: 100,
					}}
				/>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						marginBottom: 30.5,
					}}
				>
					<Text
						style={{
							color: COLORS.black,
							fontWeight: "bold",
							fontSize: 29,
						}}
					>
						{username}
					</Text>
					<Text
						style={{
							color: COLORS.secondary,
							marginTop: 9,
							fontSize: 15,
						}}
					>
						{user.email}
					</Text>
				</View>
				<View style={{ marginBottom: 170 }}>
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => setIsSetUsernameModalVisible(true)}
					>
						<Text style={{ ...style.text, ...{ color: COLORS.success } }}>
							Set username
						</Text>
						<MaterialIcons
							name="edit"
							size={iconsSize}
							color={COLORS.success}
						/>
					</TouchableOpacity>
					<SetUsernameModal
						isModalVisible={isSetUsernameModalVisible}
						setIsModalVisible={setIsSetUsernameModalVisible}
						oldUsername={user.username}
						setUsername={setUsername}
					/>
					<SetPasswordModal
						isModalVisible={isSetPasswordModalVisible}
						setIsModalVisible={setIsSetPasswordModalVisible}
						oldPassword={user.password}
						username={username}
					/>
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => setIsSetPasswordModalVisible(true)}
					>
						<Text style={{ ...style.text, ...{ color: COLORS.primary } }}>
							Set password
						</Text>
						<MaterialIcons
							name="edit"
							size={iconsSize}
							color={COLORS.primary}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => navigation.navigate("Stats page")}
					>
						<Text
							style={{ ...style.text, ...{ color: COLORS.secondary } }}
						>
							Stats page
						</Text>
						<MaterialIcons
							name="bar-chart-o"
							size={iconsSize}
							color={COLORS.secondary}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => deleteUser()}
					>
						<Text style={{ ...style.text, ...{ color: COLORS.error } }}>
							Delete account
						</Text>
						<MaterialIcons
							name="close"
							size={iconsSize}
							color={COLORS.error}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	) : null;
};

const style = StyleSheet.create({
	touchableOpacity: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 8,
		margin: 2,
		marginTop: 34.75,
	},
	text: {
		color: COLORS.secondary,
		fontSize: 21.5,
		marginRight: 10,
	},
});

export default AccountScreen;

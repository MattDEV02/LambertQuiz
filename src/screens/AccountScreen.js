import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	SafeAreaView,
	View,
	Text,
	TouchableOpacity,
	Image,
	Alert as Window,
} from "react-native";
import { supabase } from "../app/lib/supabase-client";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import SetUsernameModal from "../components/screens/AccountScreen/setUsernameModal";
import SetPasswordModal from "../components/screens/AccountScreen/setPasswordModal";
import { validateObject, validateString } from "../utils/validators";
import { removeUser } from "../utils/auth";
import { COLORS } from "../constants/theme";


// TODO: AccountOption component

const AccountScreen = ({ navigation, route }) => {

	const [user, setUser] = useState(route.params.user);
	const [username, setUsername] = useState("");
	const [isSetUsernameModalVisible, setIsSetUsernameModalVisible] =
		useState(false);
	const [isSetPasswordModalVisible, setIsSetPasswordModalVisible] =
		useState(false);

	useEffect(() => {
		const getUserUsernameAndPasswordFromEmail = async (email) => {
			const { data, error } = await supabase
				.from("users")
				.select("username, password")
				.eq("email", email)
				.single(); // UNIQUE
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				const tempUser = user;
				tempUser.username = data.username;
				tempUser.password = data.password;
				setUser(tempUser);
				setUsername(user.username);
			}
		};
		getUserUsernameAndPasswordFromEmail(user.email);
	}, []);

	const iconsSize = 26;

	const handleOnDeleteUserPress = () => {
		Window.alert(
			"Are your sure?",
			`Are you sure you want to deleted your account with this email: ${user.email} ?`,
			[
				{
					text: "Yes",
					onPress: () => {
						Window.alert(
							"Account deleted successfully",
							`Your account is deleted.`,
						);
						removeUser(user);
					},
				},
				{
					text: "No",
					onPress: () => {
						Window.alert(
							"Account not deleted",
							`You can continue to play with us.`,
						);
					},
				},
			],
		);
	};

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
				{/* LOGO */}
				<Image
					source={require("../../assets/images/logo.png")}
					resizeMode={"contain"}
					style={{
						width: "43.5%",
						height: "22.5%",
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
						{validateString(username) ? username : null}
					</Text>
					<Text
						style={{
							color: COLORS.secondary,
							marginTop: 9,
							fontSize: 15,
						}}
					>
						{validateString(user.email) ? user.email : null}
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
						onPress={() => handleOnDeleteUserPress()}
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
	) : (
		<Text>...</Text>
	);
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

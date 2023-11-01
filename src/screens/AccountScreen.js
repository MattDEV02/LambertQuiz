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
import { signOut } from "../utils/auth";
import FormInput from "../components/shared/FormInput";

const AccountScreen = ({ navigation, route }) => {
	const [usernameClicked, setUsernameClicked] = useState(false);
	const [passwordClicked, setPasswordClicked] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const user = route.params.user;
	const iconsSize = 26;

	const handleOnPressSetUsername = () => {
		setUsernameClicked(true);

		setTimeout(() => {}, 2000);
		console.log("username", usernameClicked);
	};

	const handleOnPressSetPassword = () => {
		setPasswordClicked(true);
		console.log("password", passwordClicked);
	};

	return (
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
						{user.username}
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
					{usernameClicked ? (
						<FormInput
							labelText="Username"
							placeholderText="Enter your username (between 3 & 8 chars)"
							//	inputError={usernameError}
							//value={username}
							style={{
								marginBottom: 10,
							}}
							maxLength={10}
							autoComplete={"username"}
							autoCorrect={true}
							inputMode={"text"}
							keyboardType={"default"}
							//onChangeText={(username) => setUsername(username)}
						/>
					) : (
						<TouchableOpacity
							style={style.touchableOpacity}
							onPress={() => handleOnPressSetUsername()}
						>
							<Text
								style={{ ...style.text, ...{ color: COLORS.success } }}
							>
								Set username
							</Text>
							<MaterialIcons
								name="edit"
								size={iconsSize}
								color={COLORS.success}
							/>
						</TouchableOpacity>
					)}

					{passwordClicked ? (
						<FormInput
							labelText="Password"
							placeholderText="Enter your password"
							value={password}
							//	inputError={passwordError}
							autoComplete={"off"}
							autoCorrect={false}
							style={{}}
							maxLength={32}
							secureTextEntry={true}
							onChangeText={(password) => setPassword(password)}
						/>
					) : (
						<TouchableOpacity
							style={style.touchableOpacity}
							onPress={() => handleOnPressSetPassword()}
						>
							<Text
								style={{ ...style.text, ...{ color: COLORS.primary } }}
							>
								Set password
							</Text>
							<MaterialIcons
								name="edit"
								size={iconsSize}
								color={COLORS.primary}
							/>
						</TouchableOpacity>
					)}
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
						onPress={() => signOut()}
					>
						<Text style={{ ...style.text, ...{ color: COLORS.error } }}>
							Logout
						</Text>
						<MaterialIcons
							name="arrow-circle-o-left"
							size={iconsSize}
							color={COLORS.error}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
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

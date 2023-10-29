import React, {
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

export const AccountScreen = ({ navigation, route }) => {
	const user = route.params.user;
	const iconsSize = 26;
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
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => console.log(1)}
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
					<TouchableOpacity
						style={style.touchableOpacity}
						onPress={() => console.log(2)}
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
		marginTop: 35,
	},
	text: {
		color: COLORS.secondary,
		fontSize: 21.5,
		marginRight: 11.5,
	},
});

export default AccountScreen;

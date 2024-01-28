import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import { COLORS, ACCOUNTOPTIONS } from "../../../constants/theme";

const AccountOption = ({
	accountOption,
	handleOnSetUsernamePress = null,
	handleOnSetPasswordPress = null,
	handleOnStatsPagePress = null,
	handleOnDeleteUserPress = null,
}) => {
	const defaultCase = () =>
		console.error(
			"The accountOption " + accountOption + " is not supported.",
		);

	const handleOnPress = () => {
		switch (accountOption) {
			case ACCOUNTOPTIONS.setUsername:
				handleOnSetUsernamePress();
				break;
			case ACCOUNTOPTIONS.setPassword:
				handleOnSetPasswordPress();
				break;
			case ACCOUNTOPTIONS.statsPage:
				handleOnStatsPagePress();
				break;
			case ACCOUNTOPTIONS.deleteAccount:
				handleOnDeleteUserPress();
				break;
			default:
				defaultCase();
				break;
		}
	};

	const getOptionColor = () => {
		switch (accountOption) {
			case ACCOUNTOPTIONS.setUsername:
				return COLORS.success;
			case ACCOUNTOPTIONS.setPassword:
				return COLORS.primary;
			case ACCOUNTOPTIONS.statsPage:
				return COLORS.secondary;
			case ACCOUNTOPTIONS.deleteAccount:
				return COLORS.error;
			default:
				defaultCase();
				break;
		}
	};

	const getIconName = () => {
		switch (accountOption) {
			case ACCOUNTOPTIONS.setUsername:
				return "edit";
			case ACCOUNTOPTIONS.setPassword:
				return "edit";
			case ACCOUNTOPTIONS.statsPage:
				return "bar-chart-o";
			case ACCOUNTOPTIONS.deleteAccount:
				return "close";
			default:
				console.error(
					"The accountOption " + accountOption + " is not supported.",
				);
				break;
		}
	};

	return (
		<TouchableOpacity
			style={styles.touchableOpacity}
			onPress={() => handleOnPress()}
		>
			<Text style={{ ...styles.text, color: getOptionColor() }}>
				{accountOption}
			</Text>
			<MaterialIcons
				name={getIconName()}
				size={26}
				color={getOptionColor()}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	touchableOpacity: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		fontSize: 8,
		margin: 2,
		marginTop: 34.75,
	},
	text: {
		fontSize: 22,
		marginRight: 10,
	},
});

export default AccountOption;

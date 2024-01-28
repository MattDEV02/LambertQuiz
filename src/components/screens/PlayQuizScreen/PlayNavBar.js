import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS, appName } from "../../../constants/theme";

const PlayNavBar = ({ category, correctCount, incorrectCount }) => {
	const iconsSize = 14;
	return (
		<View
			style={{
				...styles.container,
				justifyContent: "space-between",
				paddingVertical: 10,
				paddingHorizontal: 20,
				backgroundColor: COLORS.white,
				elevation: 4,
			}}
		>
			<View>
				{/* TITLE */}
				<Text style={styles.text}>{appName}</Text>
			</View>
			<View
				style={{
					...styles.container,
					alignItems: "right",
					justifyContent: "flex-end",
				}}
			>
				{/* Category */}
				<Text style={{ ...styles.text, fontWeight: "bold" }}>
					{category}
				</Text>
			</View>
			{/* Corret and Incorrect */}
			<View style={styles.container}>
				{/* Correct */}
				<View
					style={{
						...styles.container,
						backgroundColor: COLORS.success,
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderTopLeftRadius: 10,
						borderBottomLeftRadius: 10,
					}}
				>
					<MaterialIcons
						name="check"
						size={iconsSize}
						style={styles.icon}
					/>
					{/* correct count */}
					<Text style={styles.textIcon}>{correctCount}</Text>
				</View>
				{/* Incorrect */}
				<View
					style={{
						...styles.container,
						backgroundColor: COLORS.error,
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderTopRightRadius: 10,
						borderBottomRightRadius: 10,
					}}
				>
					<MaterialIcons
						name="close"
						size={iconsSize}
						style={styles.icon}
					/>
					{/* incorrect count */}
					<Text style={styles.textIcon}>{incorrectCount}</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		color: COLORS.white,
	},
	text: {
		fontSize: 17.5,
		fontWeight: "normal",
	},
	textIcon: {
		color: COLORS.white,
		marginLeft: 6,
	},
});

export default PlayNavBar;

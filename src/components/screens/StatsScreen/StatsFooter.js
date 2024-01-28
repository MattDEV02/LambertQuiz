import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { validateString } from "../../../utils/validators";

const StatsFooter = ({ userSub, userSubDays, userPrefCategory }) => {
	return (
		<View style={styles.footer}>
			<Text style={styles.footerText}>
				You are our User since {userSub}, that's {userSubDays}{" "}
				{userSubDays > 1 ? "days" : "day"} !
			</Text>
			<Text style={styles.footerText}>
				Prefered category:{" "}
				{validateString(userPrefCategory) ? userPrefCategory : "None"}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: { marginTop: 16, marginBottom: 35 },
	footerText: {
		fontSize: 16,
		margin: 4.25,
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default StatsFooter;

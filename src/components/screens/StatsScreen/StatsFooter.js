import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { validateString } from "../../../utils/validators";

const StatsFooter = ({
	userSub,
	userSubDays,
	userPrefCategory,
	addingTextStyle,
}) => {
	return (
		<View style={style.footer}>
			<Text style={{ ...addingTextStyle, ...style.footerText }}>
				You are our User since {userSub}, that's {userSubDays} days!
			</Text>
			<Text style={{ ...addingTextStyle, ...style.footerText }}>
				Prefered category:{" "}
				{validateString(userPrefCategory) ? userPrefCategory : "None"}
			</Text>
		</View>
	);
};

const style = StyleSheet.create({
	footer: { marginTop: 16, marginBottom: 27.5 },
	footerText: { fontSize: 16 },
});

export default StatsFooter;

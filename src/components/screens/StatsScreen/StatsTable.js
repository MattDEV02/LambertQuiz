import React from "react";
import { View, Text, StyleSheet, ScrollView, LogBox } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { COLORS } from "../../../constants/theme";

const StatsTable = ({ matrix }) => {
	LogBox.ignoreLogs([
		"Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
	]);
	return (
		<View style={{ marginTop: 25, marginBottom: -11.5 }}>
			<ScrollView horizontal={true}>
				<Table borderStyle={{ borderWidth: 1, borderColor: COLORS.black }}>
					<Row
						data={[
							"User",
							"Average",
							"Better",
							"%Comp",
							"TotQuiz",
							"TotScor",
						]}
						style={style.head}
						textStyle={{
							...style.text,
							color: COLORS.white,
						}}
					/>
					{matrix.length > 0 ? (
						<Rows
							data={matrix}
							style={style.row}
							textStyle={style.text}
						/>
					) : (
						<Text style={style.text}>No rows</Text>
					)}
				</Table>
			</ScrollView>
		</View>
	);
};

const style = StyleSheet.create({
	container: { flex: 1 },
	head: { height: 35, backgroundColor: COLORS.primary, color: COLORS.white },
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
	row: { backgroundColor: "#E6E4E4" },
});

export default StatsTable;

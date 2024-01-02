import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
	Table,
	//TableWrapper,
	Row,
	Rows,
	//Col,
	//Cols,
	//Cell,
} from "react-native-table-component";
import { COLORS } from "../../../constants/theme";

const StatsTable = ({ matrix }) => {
	return (
		<View>
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
				<Rows data={matrix} style={style.row} textStyle={style.text} />
			</Table>
		</View>
	);
};

const style = StyleSheet.create({
	container: { flex: 1 },
	head: { height: 35, backgroundColor: COLORS.primary, color: COLORS.white },
	text: { margin: 3.5, textAlign: "center", fontWeight: "bold" },
	row: { backgroundColor: COLORS.white },
});

export default StatsTable;

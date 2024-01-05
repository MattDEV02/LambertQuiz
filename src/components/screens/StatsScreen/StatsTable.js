import React from "react";
import { View, Text, StyleSheet, ScrollView, LogBox } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { COLORS } from "../../../constants/theme";

const StatsTable = ({ matrix }) => {
	LogBox.ignoreLogs([
		"Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
	]);
	const widthArr = [85, 105, 100, 107, 105, 110];
	return (
		<View style={{ marginTop: 25, marginBottom: -11.5 }}>
			<ScrollView horizontal={true}>
				<View>
					<Table borderStyle={style.borderStyle}>
						<Row
							data={[
								"User",
								"Average score",
								"Total score",
								"Better score",
								"Total quizzes",
								"% Completition",
							]}
							style={style.head}
							textStyle={{
								...style.text,
								color: COLORS.white,
							}}
							widthArr={widthArr}
						/>
					</Table>
					<ScrollView style={style.dataWrapper}>
						{matrix.length > 0 ? (
							<Table
								borderStyle={style.borderStyle}
							>
								<Rows
									data={matrix}
									style={style.row}
									textStyle={{...style.text, fontSize: 15}}
									widthArr={widthArr}
								/>
							</Table>
						) : (
							<Text style={style.text}>No rows</Text>
						)}
					</ScrollView>
				</View>
			</ScrollView>
		</View>
	);
};

const style = StyleSheet.create({
	container: { flex: 1 },
	borderStyle: { borderWidth: 1, borderColor: COLORS.black },
	head: { height: 35, backgroundColor: COLORS.primary, color: COLORS.white },
	dataWrapper: { marginTop: -1 },
	row: { height: 30, backgroundColor: "#E6E4E4" },
	text: { textAlign: "center", fontWeight: "bold" },
});

export default StatsTable;

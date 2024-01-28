import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	LogBox,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import TableTooltip from "./table/TableTooltip";
import { COLORS } from "../../../constants/theme";

const StatsTable = ({ matrix }) => {
	LogBox.ignoreLogs([
		"Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
	]);

	const widthArr = [35, 100, 105, 100, 107, 105, 110];

	const [tooltipVisible, setTooltipVisible] = useState(false);

	return (
		<View>
			<TableTooltip
				tooltipVisible={tooltipVisible}
				setTooltipVisible={setTooltipVisible}
			/>
			<ScrollView horizontal={true}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setTooltipVisible(true)}
					onPressOut={() => setTooltipVisible(false)}
				>
					<View>
						<Table borderStyle={styles.borderStyle}>
							<Row
								data={[
									"n°",
									"User",
									"Average score",
									"Worst score",
									"Better score",
									"Total quizzes",
									"% Completition",
								]}
								style={styles.head}
								textStyle={{
									...styles.text,
									color: COLORS.white,
								}}
								widthArr={widthArr}
							/>
						</Table>
						<ScrollView style={styles.dataWrapper}>
							{matrix.length > 0 ? (
								<Table borderStyle={styles.borderStyle}>
									<Rows
										data={matrix}
										style={styles.row}
										textStyle={{ ...styles.text, fontSize: 15 }}
										widthArr={widthArr}
									/>
								</Table>
							) : (
								<View style={{ marginTop: 12.5, width: "70%" }}>
									<Text
										style={{
											...styles.text,
											fontSize: 16,
										}}
									>
										No Users to show
									</Text>
								</View>
							)}
						</ScrollView>
					</View>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	borderStyle: { borderWidth: 1, borderColor: COLORS.black },
	head: { height: 35, backgroundColor: COLORS.primary, color: COLORS.white },
	dataWrapper: { marginTop: -1 },
	row: { height: 30, backgroundColor: "#E6E4E4" },
	text: { textAlign: "center", fontWeight: "bold" },
});

export default StatsTable;

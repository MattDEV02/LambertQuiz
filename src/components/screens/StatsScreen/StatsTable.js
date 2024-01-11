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
import Tooltip from "react-native-walkthrough-tooltip";
import { COLORS } from "../../../constants/theme";

const StatsTable = ({ matrix }) => {
	
	LogBox.ignoreLogs([
		"Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.",
	]);

	const widthArr = [85, 105, 100, 107, 105, 110];

	const [tooltipVisible, setTooltipVisible] = useState(false);

	return (
		<View>
			<Tooltip
				isVisible={tooltipVisible}
				content={
					<Text style={{ fontWeight: "bold", color: COLORS.primary }}>
						Best 5 LambertQuiz Players
					</Text>
				}
				placement={"top"}
				useReactNativeModal={false}
				disableShadow={true}
				onClose={() => setTooltipVisible(false)}
			></Tooltip>
			<ScrollView horizontal={true}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setTooltipVisible(true)}
					onPressOut={() => setTooltipVisible(false)}
				>
					<View>
						<Table borderStyle={style.borderStyle}>
							<Row
								data={[
									"User",
									"Average score",
									//	"Total score",
									"Worst score",
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
								<Table borderStyle={style.borderStyle}>
									<Rows
										data={matrix}
										style={style.row}
										textStyle={{ ...style.text, fontSize: 15 }}
										widthArr={widthArr}
									/>
								</Table>
							) : (
								<View style={{ marginTop: 12.5, width: "70%" }}>
									<Text
										style={{
											...style.text,
											fontSize: 16,
										}}
									>
										No rows to show
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

const style = StyleSheet.create({
	borderStyle: { borderWidth: 1, borderColor: COLORS.black },
	head: { height: 35, backgroundColor: COLORS.primary, color: COLORS.white },
	dataWrapper: { marginTop: -1 },
	row: { height: 30, backgroundColor: "#E6E4E4" },
	text: { textAlign: "center", fontWeight: "bold" },
});

export default StatsTable;

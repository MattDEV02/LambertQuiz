import React from "react";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, CHARTTYPES } from "../../../constants/theme";

const ChartsPicker = ({ setSelectedChart }) => {
	const items = [
		// TODO: with a loop...
		{
			label: CHARTTYPES.barChart.replace("C", " c"),
			value: CHARTTYPES.barChart,
			color: COLORS.primary,
		},
		{
			label: CHARTTYPES.lineChart.replace("C", " c"),
			value: CHARTTYPES.lineChart,
			color: COLORS.primary,
		},
		{
			label: CHARTTYPES.horizontalBarChart
				.replace("C", " c")
				.replace("B", " B"),
			value: CHARTTYPES.horizontalBarChart,
			color: COLORS.primary,
		},
		{
			label: CHARTTYPES.pieChart.replace("C", " c"),
			value: CHARTTYPES.pieChart,
			color: COLORS.primary,
		},
	];

	return (
		<View
			style={{
				marginBottom: 12,
				fontSize: 16,
				paddingLeft: 15,
				paddingVertical: 1,
				borderWidth: 0.5,
				borderColor: COLORS.black,
				backgroundColor: COLORS.white,
				borderRadius: 9,
				paddingRight: 28,
			}}
		>
			<RNPickerSelect
				onValueChange={(value) => setSelectedChart(value)}
				useNativeAndroidPickerStyle={true}
				//fixAndroidTouchableBug={true}
				pickerProps={{
					accessibilityLabel: items[0].label,
				}}
				placeholder={{
					label: "Select a Chart type...",
					value: null,
					color: COLORS.grey,
				}}
				items={items}
			/>
		</View>
	);
};

export default ChartsPicker;

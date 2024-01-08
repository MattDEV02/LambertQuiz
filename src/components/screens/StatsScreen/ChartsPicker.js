import React from "react";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { COLORS, CHARTTYPES } from "../../../constants/theme";

// TODO: charts num

const ChartsPicker = ({ setSelectedChart }) => {

	const items = [ // TODO: with a loop...
	{
		label: CHARTTYPES.barChart.replace("C", " C"),
		value: CHARTTYPES.barChart,
		color: COLORS.primary,
	},
	{
		label: CHARTTYPES.lineChart.replace("C", " C"),
		value: CHARTTYPES.lineChart,
		color: COLORS.primary,
	},
	{
		label: CHARTTYPES.pieChart.replace("C", " C"),
		value: CHARTTYPES.pieChart,
		color: COLORS.primary,
	},
]

	return (
		<View
			style={{
				marginTop: 23,
				marginBottom: 11.5,
				fontSize: 16,
				paddingLeft: 15,
				paddingVertical: 4.5,
				borderWidth: 0.5,
				borderColor: COLORS.black,
				backgroundColor: COLORS.white,
				borderRadius: 9,
				paddingRight: 28,
			}}
			testID="android_touchable_wrapper"
			activeOpacity={1}
		>
			<RNPickerSelect
				onValueChange={(value) => setSelectedChart(value)}
				useNativeAndroidPickerStyle={true}
				fixAndroidTouchableBug={true}
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

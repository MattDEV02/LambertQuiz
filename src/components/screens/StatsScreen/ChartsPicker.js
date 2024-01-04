import React from "react";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { COLORS } from "../../../constants/theme";
import MaterialIcons from "react-native-vector-icons/FontAwesome";

// TODO: charts num

const ChartsPicker = ({ chartsToSelect, setSelectedChart }) => {

	const getRandomChart = () => {
		const chartTypesArray = Object.keys(chartsToSelect);
		const chartTypesArrayLength = chartTypesArray.length;
		return chartTypesArray[Math.floor(Math.random() * (chartTypesArrayLength))]
	};

	return (
		<View
			style={{
				marginBottom: 10.5,
				fontSize: 16,
				paddingLeft: 15,
				paddingVertical: 4.5,
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
				pickerProps={{
					accessibilityLabel: "Bar Chart",
				}}
				placeholder={{
					label: "Select a Chart type...",
					value: getRandomChart(),
					color: COLORS.grey,
				}}
				items={[ // TODO: with a loop...
					{
						label: chartsToSelect.barChart.replace("C", " C"),
						value: chartsToSelect.barChart,
						color: COLORS.primary,
					},
					{
						label: chartsToSelect.lineChart.replace("C", " C"),
						value: chartsToSelect.lineChart,
						color: COLORS.primary,
					},
					{
						label: chartsToSelect.pieChart.replace("C", " C"),
						value: chartsToSelect.pieChart,
						color: COLORS.primary,
					},
				]}
			/>
		</View>
	);
};

export default ChartsPicker;

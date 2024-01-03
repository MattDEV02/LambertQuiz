import React from "react";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const ChartsPicker = ({ setSelectedChart }) => {
	return (
		<View>
			<RNPickerSelect
				onValueChange={(value) => setSelectedChart(value)}
				
				items={[
					{ label: "BarChart", value: "BarChart" },
					{ label: "LineChart", value: "LineChart" },
					{ label: "PieChart", value: "PieChart" },
				]}
			/>
		</View>
	);
};

export default ChartsPicker;

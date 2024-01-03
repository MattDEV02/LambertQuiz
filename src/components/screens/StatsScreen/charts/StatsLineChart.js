import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { COLORS, SIZES } from "../../../../constants/theme";
import PointerLabelComponent from "./shared/PointerLabelComponent";

const StatsLineChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	return (
		<View>
			<LineChart
				areaChart={true}
				startFillColor={COLORS.primary}
				endFillColor={COLORS.primary}
				startOpacity={1}
				endOpacity={0.15}
				thickness={3}
				rulesType="solid"
				width={SIZES.width}
				yAxisOffset={0}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				isAnimated={true}
				data={data}
				stepValue={1}
				showYAxisIndices={true}
				showxAxisIndices={false}
				showVerticalLines={true}
				hideRules={false}
				pointerConfig={{
					pointerStripUptoDataPoint: true,
					pointerStripColor: COLORS.error,
					pointerStripWidth: 2,
					pointerColor: COLORS.error,
					radius: 6,
					pointerLabelWidth: 100,
					pointerLabelHeight: 100,
					autoAdjustPointerLabelPosition: false,
					pointerLabelComponent: (items) => (
						<PointerLabelComponent value={items[0].value} />
					),
				}}
			/>
		</View>
	);
};

export default StatsLineChart;

import React from "react";
import { View, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { COLORS, SIZES } from "../../../../constants/theme";
import PointerLabelComponent from "./shared/PointerLabelComponent";

const StatsBarChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	return (
		<View>
			<BarChart
				width={SIZES.width}
				barWidth={26}
				yAxisOffset={0}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				frontColor={COLORS.primary}
				sideColor={COLORS.secondary}
				topColor={COLORS.grey}
				showVerticalLines={true}
				isAnimated={true}
				data={data}
				stepValue={1}
				isThreeD={true}
				side={"right"}
				rulesType={"solid"}
				showYAxisIndices={true}
				yAxisThickness={1.5}
				xAxisThickness={1.5}
				pointerConfig={{
					pointerStripUptoDataPoint: true,
					stripBehindBar: true,
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
				hideRules={false}
			/>
		</View>
	);
};

export default StatsBarChart;

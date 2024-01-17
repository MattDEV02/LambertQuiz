import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import PointerLabelComponent from "./shared/PointerLabelComponent";
import { COLORS, SIZES, pointerConfig } from "../../../../constants/theme";

const StatsBarChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	const axisThickness = 1.5;
	return (
		<View style={{ marginBottom: 29 }}>
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
				yAxisThickness={axisThickness}
				xAxisThickness={axisThickness}
				pointerConfig={{
					...pointerConfig,
					stripBehindBars: false,
					autoAdjustPointerLabelPosition: true,
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

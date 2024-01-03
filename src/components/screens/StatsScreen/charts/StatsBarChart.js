import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { COLORS, SIZES } from "../../../../constants/theme";

const StatsBarChart = ({ data, style }) => {
	const dataY = data.map((item) => item.value);
	return (
		<View style={style}>
			<BarChart
				width={SIZES.width}
				barWidth={25}
				yAxisOffset={0}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				frontColor={COLORS.primary}
				sideColor={COLORS.secondary}
				topColor={COLORS.grey}
				isAnimated={true}
				data={data}
				stepValue={1}
				isThreeD={true}
				side="right"
				showYAxisIndices={true}
				hideRules={false}
			/>
		</View>
	);
};

export default StatsBarChart;

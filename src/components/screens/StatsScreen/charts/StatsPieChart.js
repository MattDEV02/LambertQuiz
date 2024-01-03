import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { COLORS, SIZES } from "../../../../constants/theme";

const StatsPieChart = ({ data }) => {
	const dataY = data.map((item) => item.value);

		// TODO: percentage data with text propery
		
	return (
		<View>
			<PieChart
				width={SIZES.width}
				yAxisOffset={0}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				frontColor={COLORS.primary}
				sideColor={COLORS.secondary}
				topColor={COLORS.grey}
				isAnimated={true}
				data={data}
				isThreeD={true}
				showYAxisIndices={true}
				hideRules={false}
				donut
				showText
				textColor="black"
				radius={150}
				textSize={20}
				showTextBackground
				textBackgroundRadius={26}
			/>
		</View>
	);
};

export default StatsPieChart;

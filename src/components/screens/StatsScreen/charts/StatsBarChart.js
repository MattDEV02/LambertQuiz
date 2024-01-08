import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import PointerLabelComponent from "./shared/PointerLabelComponent";
import { COLORS, SIZES } from "../../../../constants/theme";
import { pointerConfig } from "../../../../constants/theme";

const StatsBarChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	return (
		<View style={{ marginBottom: 30 }}>
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

					...pointerConfig,
					stripBehindBars: false,
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

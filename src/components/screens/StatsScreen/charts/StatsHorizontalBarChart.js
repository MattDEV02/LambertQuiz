import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import PointerLabelComponent from "./shared/PointerLabelComponent";
import { COLORS, SIZES, pointerConfig } from "../../../../constants/theme";

const StatsHorizontalBarChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	const axisThickness = 1.5;
	return (
		<View style={{ marginBottom: -9.5 }}>
			<BarChart
				horizontal={true}
				showLine={true}
				lineConfig={{
					isAnimated: true,
					dataPointsRadius: 2.15,
				}}
				xAxisLabelsVerticalShift={10}
				initialSpacing={19}
				endSpacing={25}
				roundedTop={true}
				width={SIZES.width * 0.845} // 84.5 %
				yAxisOffset={0}
				barWidth={24}
				labelWidth={0}
				shiftX={-15.5}
				shiftY={-46}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				frontColor={COLORS.primary}
				showVerticalLines={true}
				isAnimated={true}
				data={data}
				rulesType={"solid"}
				showYAxisIndices={true}
				yAxisThickness={axisThickness}
				xAxisThickness={axisThickness}
				hideRules={false}
				pointerConfig={{
					...pointerConfig,
					stripBehindBars: false,
					autoAdjustPointerLabelPosition: true,
					pointerLabelComponent: (items) => (
						<PointerLabelComponent
							value={items[0].value}
							style={{
								transform: [{ rotate: "-90deg" }],
								position: "relative",
								left: -20,
							}}
						/>
					),
				}}
			/>
		</View>
	);
};

export default StatsHorizontalBarChart;

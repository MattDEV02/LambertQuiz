import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import PointerLabelComponent from "./shared/PointerLabelComponent";
import { COLORS, SIZES, pointerConfig } from "../../../../constants/theme";

const StatsHorizontalBarChart = ({ data }) => {
	data.map((item) => (item.label = item.label));
	const dataY = data.map((item) => item.value);
	const axisThickness = 1.5;
	return (
		<View style={{ marginTop: -44.5, marginBottom: -11 }}>
			<BarChart
				horizontal={true}
				autoShiftLabels={false}
				//showLine
				xAxisLabelsVerticalShift={10}
				initialSpacing={18}
				endSpacing={25}
				roundedTop={true}
				width={SIZES.width}
				yAxisOffset={0}
				barWidth={24}
				labelWidth={0}
				shiftX={-9.5}
				noOfSections={new Set(dataY).size}
				maxValue={Math.max(...dataY) + 1}
				backgroundColor={COLORS.white}
				frontColor={COLORS.primary}
				showVerticalLines={true}
				isAnimated={true}
				data={data}
				stepValue={1}
				rulesType={"solid"}
				showYAxisIndices={true}
				yAxisThickness={axisThickness}
				xAxisThickness={axisThickness}
				pointerConfig={{
					...pointerConfig,
					stripBehindBars: false,
					pointerLabelComponent: (items) => (
						<PointerLabelComponent
						
							value={items[0].value}
							style={{ transform: [{ rotate: "-90deg" }] }}
						/>
					),
				}}
				hideRules={false}
			/>
		</View>
	);
};

export default StatsHorizontalBarChart;
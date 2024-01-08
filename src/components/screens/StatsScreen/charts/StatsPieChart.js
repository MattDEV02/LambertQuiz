import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { COLORS, SIZES } from "../../../../constants/theme";

const StatsPieChart = ({ data }) => {
	const dataY = data.map((item) => item.value);
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: 4.5,
				backgroundColor: COLORS.white,
				borderWidth: 1,
				borderColor: COLORS.black,
				width: "100%",
			}}
		>
			<PieChart
				width={SIZES.width}
				labelsPosition={"outward"}
				fontWeight={"bold"}
				fontStyle={"italic"}
				backgroundColor={COLORS.white}
				textColor={COLORS.black}
				innerRadius={65}
				showTextBackground={false}
				isAnimated={true}
				data={data}
				isThreeD={false}
				donut={true}
				showText={true}
				focusOnPress={true}
				innerCircleBorderColor={COLORS.black}
				radius={145}
				textSize={16}
				inwardExtraLengthForFocused={1.75}
				extraRadiusForFocused={10}
				centerLabelComponent={() => {
					return (
						<View>
							<Text
								style={{
									fontSize: 19.5,
									textAlign: "center",
									fontWeight: "bold",
									color: COLORS.secondary,
								}}
							>
								Last 7 days Quizzes
							</Text>
						</View>
					);
				}}
			/>
		</View>
	);
};

export default StatsPieChart;

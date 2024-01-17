import React from "react";
import { Text } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { COLORS } from "../../../../constants/theme";

const TableTooltip = ({ tooltipVisible, setTooltipVisible }) => {
	return (
		<Tooltip
			isVisible={tooltipVisible}
			content={
				<Text style={{ fontWeight: "bold", color: COLORS.primary }}>
					Best 5 LambertQuiz Players per average score
				</Text>
			}
			placement={"top"}
			useReactNativeModal={false}
			disableShadow={true}
			onClose={() => setTooltipVisible(false)}
		></Tooltip>
	);
};

export default TableTooltip;

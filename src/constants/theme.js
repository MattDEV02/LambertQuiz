import { Dimensions } from "react-native";
import { APP_NAME } from "@env";

export const COLORS = {
	primary: "#007BFF", // #4630EB
	secondary: "#000020",

	success: "#00C851",
	warning: "#F0F007",
	error: "#FF4444",
	orange: "#EF7009",

	black: "#171717",
	white: "#FFFFFF",

	background: "#EFECEC",
	border: "#F5F5F7",

	grey: "#A09F9F",
};

const { width, height } = Dimensions.get("window");

export const SIZES = {
	base: 10,
	width,
	height,
};

export const appName = APP_NAME;

export const headerShown = true;

export const questionsNumber = 5;

export const CHARTTYPES = {
	barChart: "BarChart",
	lineChart: "LineChart",
	pieChart: "PieChart",
};

export const pointerConfig = {
	pointerStripUptoDataPoint: true,
	pointerStripColor: COLORS.error,
	pointerStripWidth: 2,
	pointerColor: COLORS.error,
	radius: 6,
	pointerLabelWidth: 100,
	pointerLabelHeight: 100,
};

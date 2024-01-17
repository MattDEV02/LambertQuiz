import { Dimensions } from "react-native";
import { APP_NAME } from "@env";

export const COLORS = {
	// JS ENUM
	primary: "#007BFF", 
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
	// JS ENUM
	base: 10,
	width,
	height,
};

export const appName = APP_NAME;

export const headerShown = true;

export const questionsNumber = 5;

export const CHARTTYPES = {
	// JS ENUM
	barChart: "BarChart",
	lineChart: "LineChart",
	horizontalBarChart: "HorizontalBarChart",
	pieChart: "PieChart",
};

export const ACCOUNTOPTIONS = {
	// JS ENUM
	setUsername: "Set Username",
	setPassword: "Set Password",
	statsPage: "Stats Page",
	deleteAccount: "Delete Account",
};

export const pointerConfig = {
	// JS Object
	pointerStripUptoDataPoint: true,
	pointerStripColor: COLORS.error,
	pointerStripWidth: 2,
	pointerColor: COLORS.error,
	radius: 6,
	pointerLabelWidth: 100,
	pointerLabelHeight: 100,
};

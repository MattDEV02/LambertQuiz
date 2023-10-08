import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
	primary: "#4630EB",
	secondary: "#000020",

	success: "#00C851",
	error: "#ff4444",

	black: "#171717",
	white: "#FFFFFF",

	background: "#F4F4F4",
	border: "#F5F5F7",
};

export const footerFontSize = 13.5;

export const SIZES = {
	base: 10,
	width,
	height,
};

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { APP_NAME } from "@env";

export const COLORS = {
	primary: "#007BFF", // #4630EB
	secondary: "#000020",

	success: "#00C851",
	warning: "#f0f007",
	error: "#FF4444",
	orange: "#EF7009",

	black: "#171717",
	white: "#FFFFFF",

	background: "#EFECEC",
	border: "#F5F5F7",
};

export const appName = APP_NAME;

export const footerFontSize = 14.5;

export const headerShown = true;

export const SIZES = {
	base: 10,
	width,
	height,
};

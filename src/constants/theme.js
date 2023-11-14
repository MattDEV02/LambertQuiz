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

/*
const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

a = [{id: 1, n: 'a'}, {id: 2, n: 'b'}, {id: 3, n: 'c'}, {id: 4, n: 'd'}, {id: 5, n: 'e'}];

console.log(shuffle(a).splice(0, 3));
*/

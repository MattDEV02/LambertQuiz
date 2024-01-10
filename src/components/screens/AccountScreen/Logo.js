import React from "react";
import { Image } from "react-native";

const Logo = () => {
	return (
		<Image
			source={require("../../../../assets/images/logo.png")}
			resizeMode={"contain"}
			alt={"Logo"}
			style={{
				width: "35%",
				height: "21.5%",
				marginTop: 35,
			}}
		/>
	);
};

export default Logo;

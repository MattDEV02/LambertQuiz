import React from "react";
import { Image } from "react-native";

const Logo = () => {
	return (
		<Image
			source={require("../../../../assets/images/logo.png")}
			resizeMode={"contain"}
			alt={"Logo"}
			style={{
				width: 200,
				height: 166,
				marginTop: 37,
			}}
		/>
	);
};

export default Logo;

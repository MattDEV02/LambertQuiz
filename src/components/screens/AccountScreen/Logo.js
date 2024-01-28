import React from "react";
import { Image, TouchableOpacity, Linking } from "react-native";

const Logo = () => {
	return (
		<TouchableOpacity
			onPress={() =>
				Linking.openURL(
					"https://matteolambertucci.altervista.org/lambertquiz/logo.png",
				)
			}
		>
			<Image
				source={require("../../../../assets/images/logo.png")}
				resizeMode={"contain"}
				alt={"Logo"}
				style={{
					width: 200,
					height: 166,
				}}
			/>
		</TouchableOpacity>
	);
};

export default Logo;

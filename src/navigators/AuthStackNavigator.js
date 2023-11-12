import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignInScreen, SignUpScreen } from "../screens";
import { headerShown } from "../constants/theme";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown,
			}}
			initialRouteName={"Sign In page"}
		>
			<Stack.Screen name="Sign In page" component={SignInScreen} />
			<Stack.Screen name="Sign Up page" component={SignUpScreen} />
		</Stack.Navigator>
	);
};

export default AuthStackNavigator;

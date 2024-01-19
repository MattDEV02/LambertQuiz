import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignInScreen, SignUpScreen, SignoutScreen } from "../screens";
import { AUTHROUTES } from "../constants/routeNames";
import { headerShown } from "../constants/theme";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown,
			}}
			initialRouteName={AUTHROUTES.signin}
		>
			<Stack.Screen name={AUTHROUTES.signin} component={SignInScreen} />
			<Stack.Screen name={AUTHROUTES.signup} component={SignUpScreen} />
			<Stack.Screen name={AUTHROUTES.signout} component={SignoutScreen} />
		</Stack.Navigator>
	);
};

export default AuthStackNavigator;

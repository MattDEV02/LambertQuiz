import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen, SignInScreen, SignUpScreen } from "../screens";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
			}}
		>
			<Stack.Screen name="Sign In page" component={SignInScreen} />
			<Stack.Screen name="Sign Up page" component={SignUpScreen} />
			<Stack.Screen name="Home page" component={HomeScreen} />
		</Stack.Navigator>
	);
};

export default AuthStackNavigator;

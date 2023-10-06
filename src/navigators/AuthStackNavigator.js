import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home";
import SignInScreen from "../screens/Signin";
import SignUpScreen from "../screens/Signup";
import { Header } from "react-native/Libraries/NewAppScreen";

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				HeaderShown: false,
			}}
		>
			<Stack.Screen name="SignInScreen" component={SignInScreen} />
			<Stack.Screen name="SignUpScreen" component={SignUpScreen} />
		</Stack.Navigator>
	);
};

export default AuthStackNavigator;

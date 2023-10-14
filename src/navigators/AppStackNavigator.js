import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen, PlayQuizScreen } from "../screens";

const Stack = createStackNavigator();

const AppStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: true,
			}}
		>
			<Stack.Screen name="Home page" component={HomeScreen} />
			<Stack.Screen name="Play Quiz page" component={PlayQuizScreen} />
		</Stack.Navigator>
	);
};

export default AppStackNavigator;

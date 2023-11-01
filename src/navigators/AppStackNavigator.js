import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
	HomeScreen,
	PlayQuizScreen,
	AccountScreen,
	StatsScreen,
	HelpScreen,
} from "../screens";
import { headerShown } from "../constants/theme";

const Stack = createStackNavigator();

const AppStackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown,
			}}
		>
			<Stack.Screen name="Home page" component={HomeScreen} />
			<Stack.Screen name="Account page" component={AccountScreen} />
			<Stack.Screen name="Stats page" component={StatsScreen} />
			<Stack.Screen name="Play Quiz page" component={PlayQuizScreen} />
			<Stack.Screen name="Help page" component={HelpScreen} />
		</Stack.Navigator>
	);
};

export default AppStackNavigator;

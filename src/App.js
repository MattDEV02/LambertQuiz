import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStackNavigator from "./navigators/AuthStackNavigator";
import { NavigationContainer } from "@react-navigation/native";

export default App = () => {
	return (
		<NavigationContainer>
			<AuthStackNavigator />
		</NavigationContainer>
	);
};

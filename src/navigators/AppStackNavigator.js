import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { supabase } from "../app/lib/supabase-client";
import {
	HomeScreen,
	PlayQuizScreen,
	AccountScreen,
	StatsScreen,
	HelpScreen,
	SignoutScreen,
} from "../screens";
import DrawerIcon from "../components/navigators/AppStackNavigator/DrawerIcon";
import { validateObject } from "../utils/validators";
import { COLORS, headerShown } from "../constants/theme";
import { signOut } from "../utils/auth";

const Drawer = createDrawerNavigator();

const HomeIcon = () => (
	<DrawerIcon name="home" deltaIconSize={1.5} color={COLORS.primary} />
);
const AccountIcon = () => (
	<DrawerIcon name="user-circle" deltaIconSize={-1} color={COLORS.primary} />
);
const StatsIcon = () => (
	<DrawerIcon
		name="bar-chart-o"
		deltaIconSize={-4.5}
		color={COLORS.secondary}
	/>
);

const HelpIcon = () => (
	<DrawerIcon name="info-circle" deltaIconSize={3} color={COLORS.primary} />
);

const LogoutIcon = () => (
	<DrawerIcon
		name="arrow-circle-o-left"
		deltaIconSize={3}
		color={COLORS.error}
	/>
);

// TODO: useEffect with sessionUser

const AppStackNavigator = ({ sessionUser }) => {
	const [user, setUser] = useState(sessionUser);
	const [userReady, setUserReady] = useState(false);

	useEffect(() => {
		const getUserUsernameFromEmail = async (email) => {
			const { data, error } = await supabase
				.from("users")
				.select("user_id, username, password, inserted_at")
				.eq("email", email)
				.single(); // UNIQUE
			if (validateObject(error)) {
				console.error(error);
			} else if (validateObject(data)) {
				let tempUser = sessionUser;
				tempUser.user_id = data.user_id;
				tempUser.username = data.username;
				tempUser.password = data.password;
				tempUser.inserted_at = data.inserted_at;
				tempUser.auth_id = sessionUser.id;
				delete tempUser.id;
				delete tempUser.app_metadata;
				delete tempUser.created_at;
				delete tempUser.identities;
				delete tempUser.phone;
				delete tempUser.confirmation_sent_at;
				delete tempUser.aud;
				delete tempUser.user_metadata;
				delete tempUser.confirmed_at;
				setUser(tempUser);
				setUserReady(true);
			}
		};
		getUserUsernameFromEmail(sessionUser.email);
	}, []);

	const labelFontSize = 15;

	return userReady ? (
		<Drawer.Navigator
			screenOptions={{
				headerShown,
				drawerStyle: {
					backgroundColor: COLORS.white,
					width: 230,
				},
			}}
			initialRouteName={"Home page"}
		>
			<Drawer.Screen
				name="Home page"
				component={HomeScreen}
				options={{
					drawerIcon: HomeIcon,
					title: "Home",
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name="Account page"
				component={AccountScreen}
				options={{
					drawerIcon: AccountIcon,
					title: "Account",
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name="Stats page"
				component={StatsScreen}
				options={{
					drawerIcon: StatsIcon,
					title: "Stats",
					drawerLabelStyle: {
						color: COLORS.black,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name="Help page"
				component={HelpScreen}
				options={{
					drawerIcon: HelpIcon,
					title: "Help",
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
			/>
			<Drawer.Screen
				name="Logout"
				component={SignoutScreen}
				options={{
					drawerIcon: LogoutIcon,
					title: "Logout",
					drawerLabelStyle: {
						color: COLORS.error,
						fontSize: labelFontSize,
					},
				}}
				listeners={() => ({
					drawerItemPress: (event) => {
						// Prevent default action
						event.preventDefault();
						signOut();
					},
				})}
			/>
			<Drawer.Screen
				name="Play Quiz page"
				component={PlayQuizScreen}
				options={{
					drawerLabel: () => null,
					title: null,
					drawerIcon: () => null,
					drawerItemStyle: {
						height: 0,
						width: 0,
						opacity: 0,
						display: "none",
					},
				}}
				initialParams={{ user }}
			/>
		</Drawer.Navigator>
	) : (
		<Text>...</Text>
	);
};

export default AppStackNavigator;

import React, { useState, useEffect } from "react";
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
import {
	HomeIcon,
	AccountIcon,
	StatsIcon,
	HelpIcon,
	LogoutIcon,
} from "../components/navigators/AppStackNavigator/DrawerIcons";
import Offline from "../components/shared/Offline";
import User from "../utils/User";
import { validateObject } from "../utils/validators";
import { signOut } from "../utils/auth";
import { COLORS, headerShown } from "../constants/theme";
import { APPROUTES } from "../constants/routeNames";

const Drawer = createDrawerNavigator();

const AppStackNavigator = ({ sessionUser }) => {
	const [user, setUser] = useState(sessionUser);
	const [userReady, setUserReady] = useState(false);
	const [offline, setOffline] = useState(false);

	const getUserUsernameFromEmail = async (email) => {
		const { data, error } = await supabase
			.from("users")
			.select("user_id, username, password, inserted_at, updated_at")
			.eq("email", email)
			.single(); // UNIQUE
		if (validateObject(error)) {
			console.error(error);
			setOffline(true);
		} else if (validateObject(data)) {
			setOffline(false);
			setUser(User.getUserFromSessionAndData(sessionUser, data));
			setUserReady(true);
		}
	};

	useEffect(() => {
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
			initialRouteName={APPROUTES.home}
		>
			<Drawer.Screen
				name={APPROUTES.home}
				component={HomeScreen}
				options={{
					drawerIcon: HomeIcon,
					title: APPROUTES.home.replace(" page", ""),
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name={APPROUTES.account}
				component={AccountScreen}
				options={{
					drawerIcon: AccountIcon,
					title: APPROUTES.account.replace(" page", ""),
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name={APPROUTES.stats}
				component={StatsScreen}
				options={{
					drawerIcon: StatsIcon,
					title: APPROUTES.stats.replace(" page", ""),
					drawerLabelStyle: {
						color: COLORS.black,
						fontSize: labelFontSize,
					},
				}}
				initialParams={{ user }}
			/>
			<Drawer.Screen
				name={APPROUTES.help}
				component={HelpScreen}
				options={{
					drawerIcon: HelpIcon,
					title: APPROUTES.help.replace(" page", ""),
					drawerLabelStyle: {
						color: COLORS.primary,
						fontSize: labelFontSize,
					},
				}}
			/>
			<Drawer.Screen
				name={APPROUTES.signout}
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
				name={APPROUTES.playQuiz}
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
	) : offline ? (
		<Offline />
	) : null;
};

export default AppStackNavigator;

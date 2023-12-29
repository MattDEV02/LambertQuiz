import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
	HomeScreen,
	PlayQuizScreen,
	AccountScreen,
	StatsScreen,
	HelpScreen,
} from "../screens";
import DrawerIcon from "../components/navigators/AppStackNavigator/DrawerIcon";
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

const AppStackNavigator = ({ user }) => {
	const labelFontSize = 15;
	return (
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
				component={HelpScreen}
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
				initialParams={user}
			/>
		</Drawer.Navigator>
	);
};

export default AppStackNavigator;

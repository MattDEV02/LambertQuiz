import React from "react";
import DrawerIcon from "./DrawerIcon";
import { COLORS } from "../../../constants/theme";

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

export { HomeIcon, AccountIcon, StatsIcon, HelpIcon, LogoutIcon };

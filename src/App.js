import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./navigators/AuthStackNavigator";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./app/lib/supabase-client";
import { HomeScreen, SignInScreen } from "./screens";

const App = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);
	return (
		<NavigationContainer>
			{session && session.user ? (
				<HomeScreen session={session} />
			) : (
				<AuthStackNavigator />
			)}
		</NavigationContainer>
	);
};

export default App;

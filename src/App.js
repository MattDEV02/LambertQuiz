import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./navigators/AuthStackNavigator";
import AppStackNavigator from "./navigators/AppStackNavigator";
import { supabase } from "./app/lib/supabase-client";
import { validateObject } from "./utils/validators";
import { RootSiblingParent } from "react-native-root-siblings";

const App = () => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth
			.getSession()
			.then(({ data: { session } }) => {
				setSession(session);
			})
			.catch((error) => console.error(error));

		supabase.auth.onAuthStateChange((_event, session) => {
			console.log(_event); //  INITIAL_SESSION / SIGNED_IN / SIGNED_OUT
			setSession(session);
		});
	}, []);
	return (
		<RootSiblingParent>
			<NavigationContainer>
				{validateObject(session) && validateObject(session.user) ? (
					<AppStackNavigator />
				) : (
					<AuthStackNavigator />
				)}
			</NavigationContainer>
		</RootSiblingParent>
	);
};

export default App;

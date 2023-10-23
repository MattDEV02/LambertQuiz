import { Alert } from "react-native";
import Toast from "react-native-root-toast";
import { supabase } from "../app/lib/supabase-client";
import { existsUser, storeUser } from "./database";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) Alert.alert(error.message);
	else {
		if (existsUser(email)) Toast.show("Signed in");
		else console.error("NOT EXISTS!" + email);
	}
};

export const signUp = async (email, password, username) => {
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) {
		Alert.alert(error.message);
		return false;
	} else {
		if (storeUser(email, password, username)) {
			Toast.show("Signed Up", { duration: 200 });
			return true;
		} else return false;
	}
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) Alert.alert(error.message);
	else {
		Toast.show("Signed Out");
	}
};

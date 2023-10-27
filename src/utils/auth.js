import { Alert } from "react-native";
import Toast from "react-native-root-toast";
import { supabase } from "../app/lib/supabase-client";
import { existsUser, storeUser } from "./database";
import { validateObject } from "./validators";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (validateObject(error)) Alert.alert(error.message);
	else {
		if (existsUser(email)) Toast.show("Signed In");
		else {
			Toast.show("Invalid credentials.");
		}
	}
};

export const signUp = async (email, password, username) => {
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (validateObject(error)) {
		Alert.alert(error.message);
		return false;
	} else {
		if (storeUser(email, password, username)) {
			Toast.show("Signed Up");
			return true;
		} else {
			Toast.show("There was a problem, please try again.");
			return false;
		}
	}
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) Alert.alert(error.message);
	else {
		Toast.show("Signed Out");
	}
};

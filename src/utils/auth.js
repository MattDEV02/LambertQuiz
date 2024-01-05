import { Alert as Window } from "react-native";
import Toast from "react-native-root-toast";
import { supabase } from "../app/lib/supabase-client";
import { existsUser, storeUser, deleteUser } from "./database";
import { validateObject } from "./validators";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (validateObject(error)) {
		Window.alert(error.message);
		return false;
	} else {
		if (existsUser(email)) {
			Toast.show("Signed In.");
			return true;
		} else {
			Toast.show("Invalid credentials.");
			return false;
		}
	}
};

export const signUp = async (email, password, username) => {
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (validateObject(error)) {
		Window.alert(error.message);
		return false;
	} else {
		if (storeUser(email, password, username)) {
			Toast.show("Signed Up, please confirm your email.");
			return true;
		} else {
			Toast.show("There was a problem, please try again.");
			return false;
		}
	}
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	if (validateObject(error)) {
		Window.alert(error.message);
	} else {
		Toast.show("Signed Out.");
	}
};

export const removeUser = async (user) => {
	const { data, error } = await supabase.rpc("delete_user");
	console.log(data);
	if (validateObject(error)) {
		Window.alert(error.message);
	} else if (deleteUser(user.user_id)) {
		signOut();
		Toast.show("Account deleted.");
	}
};

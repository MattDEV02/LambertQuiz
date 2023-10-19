import { Alert } from "react-native";
import { ToastAndroid } from "react-native";
import { supabase } from "../app/lib/supabase-client";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) Alert.alert(error.message);
	else {
		ToastAndroid.show("Signed in", ToastAndroid.SHORT);
	}
};

export const signUp = async (email, password) => {
	const { error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) {
		Alert.alert(error.message);
		return false;
	} else {
		ToastAndroid.show("Signed Up", ToastAndroid.SHORT);
		return true;
	}
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) Alert.alert(error.message);
	else {
		ToastAndroid.show("Signed Out", ToastAndroid.SHORT);
	}
};

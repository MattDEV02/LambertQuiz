import { Alert } from "react-native";
import { ToastAndroid } from "react-native";
import { supabase } from "../app/lib/supabase-client";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error) Alert.alert(error.message);
	else ToastAndroid.show("Signed in", ToastAndroid.SHORT);
};

export const signUp = async (email, password) => {
	const { error } = await supabase.auth.signUp({
		email: email,
		password: password,
	});

	console.log(supabase.auth.getUser());
	if (error) Alert.alert(error.message);
	else ToastAndroid.show("Signed Up", ToastAndroid.SHORT);
};

export const signOut = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) Alert.alert(error.message);
	else ToastAndroid.show("Signed Out", ToastAndroid.SHORT);
};

/*
export const signIn = (email, password) => {
	auth()
		.signInWithEmailAndPassword(email, password)
		.then(() => {
			ToastAndroid.show("Logged in", ToastAndroid.SHORT);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const signUp = (email, password, username) => {
	console.log(username);
	auth()
		.createUserWithEmailAndPassword(email, password)
		.then(() => {
			ToastAndroid.show("Signed up", ToastAndroid.SHORT);
		})
		.catch((error) => {
			console.error(error);
		});
};

export const signOut = () => {
	auth()
		.signOut()
		.then(() => {
			ToastAndroid.show("Signed out", ToastAndroid.SHORT);
		})
		.catch((error) => {
			console.error(error);
		});
};

*/

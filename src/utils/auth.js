import { Alert as Window } from "react-native";
import Toast from "react-native-root-toast";
import { supabase } from "../app/lib/supabase-client";
import { storeUser, deleteUser } from "./database";
import { validateObject, validateBoolean } from "./validators";
import { sendEmailForAccountDeleted } from "./mailers";

export const signIn = async (email, password) => {
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (validateObject(error)) {
		Window.alert(error.message);
		return false;
	} else {
		const { data, error } = await supabase.rpc(
			"check_user_password_function",
			{
				input_email: email,
				input_password: password,
			},
		);
		if (validateObject(error)) {
			console.error(error);
		} else if (validateBoolean(data) && data) {
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
		const storeUserResult = await storeUser(email, password, username);
		if (storeUserResult) {
			Toast.show("Signed Up, please confirm your email.");
			return true;
		}
		return false;
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
	const email = user.email;
	Window.alert(
		"Are your sure?",
		`Are you sure you want to deleted your account with this email: ${email} ?`,
		[
			{
				text: "Yes",
				onPress: async () => {
					const user_id = user.user_id;
					const deleteUserResult = await deleteUser(user_id);
					if (deleteUserResult) {
						const { error } = await supabase.rpc("delete_user", {
							input_email: email,
						});
						if (validateObject(error)) {
							console.error(error.message);
						}
						Window.alert(
							"Account deleted successfully",
							`Your account is deleted.`,
						);
						signOut();
						Toast.show("Account deleted.");
						sendEmailForAccountDeleted(user);
					}
				},
			},
			{
				text: "No",
				onPress: () => {
					Window.alert(
						"Account not deleted",
						`You can continue to play with us.`,
					);
				},
			},
		],
	);
};

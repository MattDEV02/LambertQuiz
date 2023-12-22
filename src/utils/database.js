import { supabase } from "../app/lib/supabase-client";
import { validateObject } from "./validators";

const tableName = "users";

export const storeUser = async (email, password, username) => {
	const { data } = await supabase
		.from(tableName)
		.select()
		.eq("email", email)
		.or("username", username)
		.single();
	const user = data;
	if (!existsUser(user)) {
		const { error } = await supabase
			.from(tableName)
			.insert({ email, password, username });
		if (validateObject(error)) {
			console.error(error);
			return false;
		}
		return true;
	}
	return false;
};

export const existsUser = (user) => {
	return validateObject(user);
};

export const updateUserUsername = async (oldUsername, newUsername) => {
	const { error } = await supabase
		.from("users")
		.update({ username: newUsername })
		.eq("username", oldUsername);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log("User usermame " + oldUsername + " uptated in " + newUsername);
	return true;
};

export const updateUserPassword = async (username, newPassword) => {
	const { error } = await supabase
		.from("users")
		.update({ password: newPassword })
		.eq("username", username);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log(
		"User usermame " + username + " password uptated in " + newPassword,
	);
	return true;
};

export const deleteUser = async (email) => {
	const { error } = await supabase.from("users").delete().eq("email", email);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log(email + " deleted.");
	return true;
};

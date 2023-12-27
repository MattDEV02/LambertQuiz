import { supabase } from "../app/lib/supabase-client";
import { validateObject } from "./validators";

const usersTableName = "users";

export const storeUser = async (email, password, username) => {
	const { data } = await supabase
		.from(usersTableName)
		.select()
		.eq("email", email)
		.or("username", username)
		.single();
	const user = data;
	if (!existsUser(user)) {
		const { error } = await supabase
			.from(usersTableName)
			.insert({ email, password, username });
		if (validateObject(error)) {
			console.error(error);
			return false;
		}
		console.log(
			"User email " + email + " ; usermame " + username + " stored.",
		);
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

export const deleteUser = async (user_id) => {
	const { error } = await supabase
		.from("users")
		.delete()
		.eq("user_id", user_id);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log("User_id " + user_id + " deleted.");
	return true;
};

export const storeProgress = async (user_id, quiz_id, startDate, endDate, score) => {
	const { data } = await supabase
		.from("progresses")
		.select()
		.eq("user_id", user_id)
		.and("quiz_id", quiz_id)
		.and("startDate", startDate)
		.single();
	const progress = data;
	if (!validateObject(progress)) {
		const { error } = await supabase
			.from("progresses")
			.insert({ user_id, quiz_id, startDate, endDate, score });
		if (validateObject(error)) {
			console.error(error);
			return false;
		}
		return true;
	}
	return false;
};
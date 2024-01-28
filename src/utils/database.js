import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import { validateObject, validateBoolean } from "./validators";

const usersTableName = "users";

export const storeUser = async (email, password, username) => {
	const { data, error } = await supabase.rpc(
		"check_user_email_username_function",
		{
			input_email: email,
			input_username: username,
		},
	);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	if (validateBoolean(data) && !data) {
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

export const updateUserDBPassword = async (email, newPassword) => {
	const { error } = await supabase
		.from("users")
		.update({ password: newPassword })
		.eq("email", email);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log("User email " + email + " password uptated.");
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
	console.log("User user_id " + user_id + " deleted.");
	return true;
};

export const storeProgress = async (
	_user,
	quiz,
	quiz_started_at,
	quiz_finished_at,
	quiz_score,
) => {
	const { data, error } = await supabase.rpc(
		"check_progress_exists_function",
		{
			input_user: _user,
			input_quiz: quiz,
			input_quiz_started_at: quiz_started_at,
		},
	);
	if (validateObject(error)) {
		console.error(error);
	} else if (validateBoolean(data) && !data) {
		const { error } = await supabase.rpc("store_progress", {
			user_id: _user,
			quiz_id: quiz,
			_quiz_started_at: moment(quiz_started_at).add(1, "hours").toDate(),
			_quiz_finished_at: moment(quiz_finished_at).add(1, "hours").toDate(),
			_quiz_score: quiz_score,
		});
		if (validateObject(error)) {
			console.error(error);
			return false;
		}
		return true;
	}
	return false;
};

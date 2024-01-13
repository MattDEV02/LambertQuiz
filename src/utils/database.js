import moment from "moment";
import { supabase } from "../app/lib/supabase-client";
import { validateObject } from "./validators";

const usersTableName = "users";

export const storeUser = async (email, password, username) => {
	const { data } = await supabase
		.from(usersTableName)
		.select("email, username")
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

export const updateUserPassword = async (email, newPassword) => {
	const { error } = await supabase
		.from("users")
		.update({ password: newPassword })
		.eq("email", email);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	console.log(
		"User email " + email + " password uptated in " + newPassword,
	);
	// TODO: send email, noreply@mail.app.supabase.io , email
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
	const { data, error2 } = await supabase.rpc("delete_user");
	console.log(data);
	if (validateObject(error2)) {
		console.error(error2.message);
	}
	console.log("User_id " + user_id + " deleted.");
	return true;
};

export const storeProgress = async (
	_user,
	quiz,
	quiz_started_at,
	quiz_finished_at,
	quiz_score,
) => {
	const { data } = await supabase
		.rpc("get_progress", {
			user_id: _user,
			quiz_id: quiz,
			_quiz_started_at: quiz_started_at,
		})
		.single();
	const progress = data;
	if (!validateObject(progress)) {
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

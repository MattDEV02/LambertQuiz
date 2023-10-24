import { supabase } from "../app/lib/supabase-client";
import { validateObject, validateArray } from "./validators";

export const storeUser = async (email, password, username) => {
	// TODO: check if user already exists.
	if (true) {
		console.log(!existsUser(email));
		console.log(email, password, username);
		const { error } = await supabase
			.from("users")
			.insert({ email, password, username });
		if (validateObject(error)) {
			console.error(error);
			return false;
		} else return true;
	} else return false;
};

export const existsUser = async (email) => {
	const { data, error } = await supabase
		.from("users")
		.select()
		.eq("email", email); // UNIQUE
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	if (!validateArray(data, 1)) return false;
	const user = data[0];
	console.log(user);
	return validateObject(user);
};

export const getUsername = async (email) => {};

export const updateUser = (email, password, username) => {};

export const deleteUser = (email, password) => {};

export const getQuizzes = async () => {
	const { data, error } = await supabase.from("quizzes").select();
	if (validateObject(error)) {
		console.error(error);
		return null;
	}
	console.log(data);
	return data;
};

export const getQuestionsFromQuizId = async (quizId) => {
	const { data, error } = await supabase
		.from("questions")
		.select()
		.eq("quiz_id", quizId);
	if (validateObject(error)) {
		console.error(error);
		return null;
	}
	console.log(data);
	return data;
};

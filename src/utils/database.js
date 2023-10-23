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

export const getUsername = async (email) => {
	const { data, error } = await supabase
		.from("users")
		.select("username")
		.eq("email", email); // UNIQUE
	if (validateObject(error)) {
		console.log(error);
		return "";
	} else {
		console.log(data);
		return "ciao";
	}
};

export const updateUser = (email, password, username) => {};

export const deleteUser = (email, password) => {};

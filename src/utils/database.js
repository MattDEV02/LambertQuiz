import { supabase } from "../app/lib/supabase-client";
import { validateObject, validateArray } from "./validators";

export const storeUser = async (email, password, username) => {
	const tableName = "users";
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

export const getUsername = async (email) => {};

export const updateUser = (email, password, username) => {};

export const deleteUser = (email, password) => {};

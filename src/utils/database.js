import { supabase } from "../app/lib/supabase-client";
import { validateObject, validateArray } from "./validators";

export const storeUser = async (email, password, username) => {
	const tableName = "users";
	const { data, error } = await supabase
		.from(tableName)
		.select()
		.eq("email", email);
	if (validateObject(error)) {
		console.error(error);
		return false;
	}
	if (!existsUser(data)) {
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

export const existsUser = (data) => {
	return validateArray(data, 1) && data.length == 1;
};

export const getUsername = async (email) => {};

export const updateUser = (email, password, username) => {};

export const deleteUser = (email, password) => {};

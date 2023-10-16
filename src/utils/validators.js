import { validate as emailValidator } from "email-validator"; // alias

// TODO: one-line functions.

export const validateString = (string) => {
	return string !== undefined && string !== null && string !== "";
};

export const validateEmail = (email) => {
	return validateString(email) && emailValidator(email) && email.length >= 6;
};
export const validatePassword = (password) => {
	return validateString(password) && password.length === 8;
};

export const validateUsername = (username) => {
	return (
		validateString(username) && username.length >= 3 && username.length <= 8
	);
};

export const validateObject = (object) => {
	return object !== undefined && object !== null;
};

export const validateURL = (URL) => {
	return (
		validateString(URL) &&
		new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?").test(
			URL,
		)
	);
};

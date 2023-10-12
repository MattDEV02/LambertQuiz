import { validate as emailValidator } from "email-validator"; // alias

const validateString = (string) => {
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

export const validateUser = (user) => {
	return user !== undefined && user !== null;
};

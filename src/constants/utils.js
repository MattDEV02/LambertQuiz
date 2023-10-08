import { validate } from "email-validator";

export const validateEmail = (email) => {
	return validate(email) && email.length >= 6;
};
export const validatePassword = (password) => {
	return password.length === 8;
};

export const validateUsername = (username) => {
	return username.length >= 3 && username.length <= 8;
};

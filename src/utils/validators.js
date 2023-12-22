import { validate as emailValidator } from "email-validator"; 

export const validateString = (string) =>
	string !== undefined && string !== null && string !== "";

export const validateEmail = (email) =>
	validateString(email) && emailValidator(email) && email.length >= 6;

export const validatePassword = (password) =>
	///^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(password) &&
	password.length >= 8 && password.length <= 32;

export const validateUsername = (username) =>
	validateString(username) && username.length >= 3 && username.length <= 10;

export const validateObject = (object) =>
	object !== undefined && object !== null;

export const validateArray = (array, minLength) =>
	validateObject(array) && array.length >= minLength;

export const validateURL = (URL) => {
	validateString(URL) &&
		new RegExp("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?").test(
			URL,
		);
};

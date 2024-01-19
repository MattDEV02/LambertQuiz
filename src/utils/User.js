export default class User {
	constructor(
		email,
		password,
		username,
		user_id,
		inserted_at,
		updated_at,
		email_confirmed_at,
	) {
		this.email = email;
		this.password = password;
		this.username = username;
		this.user_id = user_id;
		this.inserted_at = inserted_at;
		this.updated_at = updated_at;
		this.email_confirmed_at = email_confirmed_at;
	}

	static getUserFromSessionAndData = (sessionUser, dataUser) => {
		let tempUser = sessionUser;

		tempUser.user_id = dataUser.user_id;
		tempUser.username = dataUser.username;
		tempUser.password = dataUser.password;
		tempUser.inserted_at = dataUser.inserted_at;
		tempUser.updated_at = dataUser.updated_at;

		tempUser.auth_id = sessionUser.id;

		delete tempUser.id;
		delete tempUser.app_metadata;
		delete tempUser.created_at;
		delete tempUser.identities;
		delete tempUser.phone;
		delete tempUser.confirmation_sent_at;
		delete tempUser.aud;
		delete tempUser.user_metadata;
		delete tempUser.confirmed_at;

		const user = new User(
			tempUser.email,
			tempUser.password,
			tempUser.username,
			tempUser.user_id,
			tempUser.inserted_at,
			tempUser.updated_at,
			tempUser.email_confirmed_at,
		);

		return user;
	};
}

export default class User {
   constructor(email, password, username, user_id, inserted_at, updated_at, email_confirmed_at) {
      this.email = email;
      this.password = password;
      this.username = username;
      this.user_id = user_id;
      this.inserted_at = inserted_at;
      this.updated_at = updated_at;
      this.email_confirmed_at = email_confirmed_at;
   }
};
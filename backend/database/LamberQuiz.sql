DROP SCHEMA IF EXISTS lambertquiz CASCADE ;

CREATE SCHEMA IF NOT EXISTS lambertquiz;

SET search_path TO lambertquiz; 


SET TIME ZONE 'Europe/Rome';

SELECT VERSION();

SELECT CURRENT_SCHEMA();


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



DROP TYPE IF EXISTS categories;

CREATE TYPE categories AS ENUM ('France', 'Egypt', 'Math');


--- Users:

DROP TABLE IF EXISTS lambertquiz.users;

CREATE TABLE IF NOT EXISTS lambertquiz.users (
	user_id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR ( 40 ) UNIQUE NOT NULL,
	password char ( 8 ) NOT NULL,
  username VARCHAR ( 10 ) UNIQUE NOT NULL,
	inserted_at timestamp WITH time zone DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at timestamp WITH time zone DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON COLUMN lambertquiz.users.user_id IS 'The integer incremental User ID.';

COMMENT ON COLUMN lambertquiz.users.email IS 'The unique User account email.';

COMMENT ON COLUMN lambertquiz.users.password IS 'The non-unique User account password.';

COMMENT ON COLUMN lambertquiz.users.username IS 'The unique User account username.';

COMMENT ON COLUMN lambertquiz.users.inserted_at IS 'The timestamp date and time when the record was inserted.';

COMMENT ON COLUMN lambertquiz.users.updated_at IS 'The timestamp date and time when the record was updated.';

COMMENT ON TABLE lambertquiz.users IS 'LambertQuiz app Users table.';

CREATE OR REPLACE TRIGGER set_timestamp
BEFORE UPDATE ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_unsigned_user_id CHECK (lambertquiz.users.user_id >= 0);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_email_min_length CHECK (LENGTH(lambertquiz.users.email) >= 6);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_username_min_length CHECK (LENGTH(lambertquiz.users.username) >= 3);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_inserted_at_updated_at CHECK (lambertquiz.users.inserted_at <= users.updated_at);

INSERT INTO lambertquiz.users (email, password, username) VALUES ('matteolambertucci3@gmail.com', '12345678', 'matt');

SELECT * FROM lambertquiz.users;



--- Quizzes

DROP TABLE IF EXISTS lambertquiz.quizzes;

CREATE TABLE IF NOT EXISTS lambertquiz.quizzes (
  quiz_id SERIAL NOT NULL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category categories NOT NULL
);

COMMENT ON COLUMN lambertquiz.quizzes.quiz_id IS 'The integer incremental Quiz ID.';

COMMENT ON COLUMN lambertquiz.quizzes.title IS 'The Quiz title.';

COMMENT ON COLUMN lambertquiz.quizzes.title IS 'The Quiz description.';

COMMENT ON COLUMN lambertquiz.quizzes.category IS 'The Quiz category in categories ENUM.';

COMMENT ON TABLE lambertquiz.quizzes IS 'LambertQuiz app Quizzes with questions and responses.';

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_unsigned_quiz_id CHECK (lambertquiz.quizzes.quiz_id >= 0);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_title_min_length CHECK (LENGTH(lambertquiz.quizzes.title) >= 3);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_questions_description_min_length CHECK (LENGTH(lambertquiz.quizzes.description) >= 8);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_category_min_length CHECK (LENGTH(lambertquiz.quizzes.category::text) >= 3);


INSERT INTO lambertquiz.quizzes (title, description, category) VALUES ('France culture Quiz', 'Simple Quiz on the France culture', 'France'), ('Egypt culture Quiz', 'Simple Quiz on the Egypt culture', 'Egypt'),  ('Math Quiz', 'Simple Math Quiz with simple calculations.', 'Math');


SELECT * FROM lambertquiz.quizzes;



--- Questions

DROP TABLE IF EXISTS lambertquiz.questions;

CREATE TABLE IF NOT EXISTS lambertquiz.questions (
  question_id SERIAL NOT NULL PRIMARY KEY,
  text TEXT NOT NULL,
  category categories NOT NULL,
  imageURL TEXT,
  multipleSolutions BOOLEAN NOT NULL,
  options text ARRAY[4] NOT NULL,
  solution text NOT NULL,
  quiz integer NOT NULL REFERENCES lambertquiz.quizzes(quiz_id),
  UNIQUE(text, category)
);

COMMENT ON COLUMN lambertquiz.questions.question_id IS 'The integer incremental quiz Question ID.';

COMMENT ON COLUMN lambertquiz.questions.text IS 'The quiz Question text.';

COMMENT ON COLUMN lambertquiz.questions.category IS 'The quiz Question category in categories ENUM.';

COMMENT ON COLUMN lambertquiz.questions.imageURL IS 'The quiz Question image URL.';

COMMENT ON COLUMN lambertquiz.questions.multipleSolutions IS 'If the quiz Question has multiple Solutions.';

COMMENT ON COLUMN lambertquiz.questions.options IS 'The four quiz Question Options.';

COMMENT ON COLUMN lambertquiz.questions.solution IS 'The quiz Question response solution in options array.';

COMMENT ON TABLE lambertquiz.questions IS 'LambertQuiz app Question with responses.';

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_unsigned_question_id CHECK (lambertquiz.questions.question_id >= 0);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_text_min_length CHECK (LENGTH(lambertquiz.questions.text) >= 8);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_category_min_length CHECK (LENGTH(lambertquiz.questions.category::text) >= 3);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_imageURL_min_length CHECK (LENGTH(lambertquiz.questions.imageURL) >= 8);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_imageURL_valid CHECK((lambertquiz.questions.imageURL ~ '^[a-z](?:[-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~!\$&''\(\)\*\+,;=:@])|[\/\?])*)?'::text));

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_options_4_length CHECK (ARRAY_LENGTH(lambertquiz.questions.options, 1) = 4);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_option_min_length CHECK (LENGTH(lambertquiz.questions.solution) >= 1);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_unsigned_solution CHECK (lambertquiz.questions.quiz >= 0);


CREATE OR REPLACE FUNCTION trigger_unique_options_array()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    NEW.options[1] = NEW.options[2] OR
    NEW.options[1] = NEW.options[3] OR
    NEW.options[1] = NEW.options[4] OR
    NEW.options[2] = NEW.options[3] OR
    NEW.options[2] = NEW.options[4] OR
    NEW.options[3] = NEW.options[4]
  ) THEN
    RAISE EXCEPTION 'The options array elements must be different!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER unique_options_array
BEFORE INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION trigger_unique_options_array();

CREATE OR REPLACE FUNCTION trigger_solution_in_options_array()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.solution != NEW.options[1] AND NEW.solution != NEW.options[2] AND NEW.solution != NEW.options[3] AND NEW.solution != NEW.options[4]) THEN
    RAISE EXCEPTION 'The solution must be in options array!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER solution_in_options_array
BEFORE INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION trigger_solution_in_options_array();

CREATE OR REPLACE FUNCTION trigger_quiz_question_category()
RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT COUNT(lambertquiz.quizzes.quiz_id) FROM lambertquiz.quizzes JOIN lambertquiz.questions ON lambertquiz.quizzes.quiz_id = lambertquiz.questions.quiz WHERE lambertquiz.quizzes.category <> lambertquiz.questions.category) > 0) THEN
    DELETE FROM lambertquiz.questions USING lambertquiz.quizzes WHERE lambertquiz.questions.question_id = lambertquiz.quizzes.quiz_id AND lambertquiz.quizzes.category <> lambertquiz.questions.category;  
 	RAISE EXCEPTION 'The Question inserted has different category from its quiz.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER quiz_question_category
AFTER INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION trigger_quiz_question_category();


INSERT INTO lambertquiz.questions (text, category, imageURL, multipleSolutions, options, solution, quiz) VALUES 
('How much is tall the Eiffel Tower ?', 'France', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg', false, '{"71 meters", "72 meters", "1 meters", "100 meters"}', '71 meters', 1),
('How much is large the Giza Sphinx ?', 'Egypt', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg', false, '{"10 meters", "72 meters", "1 meters", "100 meters"}', '72 meters', 2),
('How much is 2 + 3 ?', 'Math', 'https://t3.ftcdn.net/jpg/04/83/90/18/360_F_483901821_46VsNR67uJC3xIKQN4aaxR6GtAZhx9G8.jpg', false, '{"5", "18", "0", "-2"}', '5', 3);


SELECT * from lambertquiz.questions;



--SELECT * FROM pg_catalog.pg_tables  WHERE schemaname = 'lambertquiz';
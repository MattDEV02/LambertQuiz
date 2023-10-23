SELECT VERSION();

SELECT CURRENT_SCHEMA();

DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA IF NOT EXISTS public;

SET SEARCH_PATH TO public; 

SET TIME ZONE 'Europe/Rome';

SELECT NOW();

DROP TYPE IF EXISTS categories;

CREATE TYPE categories AS ENUM ('France', 'Egypt', 'Math');

DROP EXTENSION IF EXISTS PGCRYPTO CASCADE;

CREATE EXTENSION IF NOT EXISTS PGCRYPTO;


--- Users:

DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users (
	user_id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR ( 40 ) UNIQUE NOT NULL,
	password VARCHAR ( 72 ) NOT NULL,
  username VARCHAR ( 10 ) UNIQUE NOT NULL,
	inserted_at timestamp WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+2 hours') UNIQUE NOT NULL,
  updated_at timestamp WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+2 hours') NOT NULL
);

COMMENT ON COLUMN public.users.user_id IS 'The integer incremental User ID.';

COMMENT ON COLUMN public.users.email IS 'The unique User account email.';

COMMENT ON COLUMN public.users.password IS 'The non-unique User account password stored with the BF algorithm.';

COMMENT ON COLUMN public.users.username IS 'The unique User account username.';

COMMENT ON COLUMN public.users.inserted_at IS 'The timestamp date and time when the record was inserted.';

COMMENT ON COLUMN public.users.updated_at IS 'The timestamp date and time when the record was updated.';

COMMENT ON TABLE public.users IS 'public app Users table.';

CREATE OR REPLACE FUNCTION user_updated_at_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+2 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_updated_at_set_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION user_updated_at_set_timestamp();

ALTER TABLE public.users ADD CONSTRAINT check_users_unsigned_user_id CHECK (public.users.user_id > 0);

ALTER TABLE public.users ADD CONSTRAINT check_users_email_min_length CHECK (LENGTH(public.users.email) >= 6);

ALTER TABLE public.users ADD CONSTRAINT check_users_email_valid CHECK((public.users.email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text));

ALTER TABLE public.users ADD CONSTRAINT check_users_password_min_length CHECK (LENGTH(public.users.password) >= 16);

ALTER TABLE public.users ADD CONSTRAINT check_users_username_min_length CHECK (LENGTH(public.users.username) >= 3);

ALTER TABLE public.users ADD CONSTRAINT check_users_inserted_at_updated_at CHECK (public.users.inserted_at <= users.updated_at);

INSERT INTO public.users (email, password, username) VALUES ('matteolambertucci3@gmail.com', CRYPT('12345678', GEN_SALT('BF')), 'matt');

SELECT * FROM public.users;



--- Quizzes

DROP TABLE IF EXISTS public.quizzes;

CREATE TABLE IF NOT EXISTS public.quizzes (
  quiz_id SERIAL NOT NULL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category categories NOT NULL
);

COMMENT ON COLUMN public.quizzes.quiz_id IS 'The integer incremental Quiz ID.';

COMMENT ON COLUMN public.quizzes.title IS 'The Quiz title.';

COMMENT ON COLUMN public.quizzes.title IS 'The Quiz description.';

COMMENT ON COLUMN public.quizzes.category IS 'The Quiz category in categories ENUM.';

COMMENT ON TABLE public.quizzes IS 'public app Quizzes with questions and responses.';

ALTER TABLE public.quizzes ADD CONSTRAINT check_quizzes_unsigned_quiz_id CHECK (public.quizzes.quiz_id > 0);

ALTER TABLE public.quizzes ADD CONSTRAINT check_quizzes_title_min_length CHECK (LENGTH(public.quizzes.title) >= 3);

ALTER TABLE public.quizzes ADD CONSTRAINT check_questions_description_min_length CHECK (LENGTH(public.quizzes.description) >= 8);

ALTER TABLE public.quizzes ADD CONSTRAINT check_quizzes_category_min_length CHECK (LENGTH(public.quizzes.category::text) >= 3);

CREATE OR REPLACE FUNCTION quiz_question_category()
RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT COUNT(public.quizzes.quiz_id) FROM public.quizzes JOIN public.questions ON public.quizzes.quiz_id = public.questions.quiz WHERE public.quizzes.category <> public.questions.category) > 0) THEN
 	RAISE EXCEPTION 'Question and Quiz with different category!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_quiz_question_category
AFTER UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();

INSERT INTO public.quizzes (title, description, category) VALUES ('France culture Quiz', 'Simple Quiz on the France culture', 'France'), ('Egypt culture Quiz', 'Simple Quiz on the Egypt culture', 'Egypt'),  ('Math Quiz', 'Simple Math Quiz with simple calculations.', 'Math');


SELECT * FROM public.quizzes;



--- Questions

DROP TABLE IF EXISTS public.questions;

CREATE TABLE IF NOT EXISTS public.questions (
  question_id SERIAL NOT NULL PRIMARY KEY,
  text TEXT NOT NULL,
  category categories NOT NULL,
  imageURL TEXT,
  options text ARRAY[4] NOT NULL,
  solution text NOT NULL,
  quiz integer NOT NULL,
  UNIQUE(text, category),
  UNIQUE(imageURL, options, solution, quiz),
  CONSTRAINT question_quiz_fk FOREIGN KEY(quiz) REFERENCES public.quizzes(quiz_id) ON DELETE CASCADE
);

COMMENT ON COLUMN public.questions.question_id IS 'The integer incremental quiz Question ID.';

COMMENT ON COLUMN public.questions.text IS 'The quiz Question text.';

COMMENT ON COLUMN public.questions.category IS 'The quiz Question category in categories ENUM.';

COMMENT ON COLUMN public.questions.imageURL IS 'The quiz Question image URL.';

COMMENT ON COLUMN public.questions.options IS 'The four quiz Question Options.';

COMMENT ON COLUMN public.questions.solution IS 'The quiz Question response solution in options array.';

COMMENT ON TABLE public.questions IS 'public app Questions with responses.';

ALTER TABLE public.questions ADD CONSTRAINT check_questions_unsigned_question_id CHECK (public.questions.question_id > 0);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_text_min_length CHECK (LENGTH(public.questions.text) >= 8);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_category_min_length CHECK (LENGTH(public.questions.category::text) >= 3);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_imageURL_min_length CHECK (LENGTH(public.questions.imageURL) >= 8);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_imageURL_valid CHECK((public.questions.imageURL ~ '^[a-z](?:[-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~!\$&''\(\)\*\+,;=:@])|[\/\?])*)?'::text));

ALTER TABLE public.questions ADD CONSTRAINT check_questions_options_4_length CHECK (ARRAY_LENGTH(public.questions.options, 1) = 4);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_option_min_length CHECK (LENGTH(public.questions.solution) >= 1);

ALTER TABLE public.questions ADD CONSTRAINT check_questions_unsigned_solution CHECK (public.questions.quiz >= 0);


CREATE OR REPLACE FUNCTION unique_options_array()
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


CREATE OR REPLACE TRIGGER trigger_insert_unique_options_array
BEFORE INSERT ON public.questions
FOR EACH ROW
EXECUTE FUNCTION unique_options_array();

CREATE OR REPLACE TRIGGER trigger_update_unique_options_array
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION unique_options_array();

CREATE OR REPLACE FUNCTION solution_in_options_array()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.solution != NEW.options[1] AND NEW.solution != NEW.options[2] AND NEW.solution != NEW.options[3] AND NEW.solution != NEW.options[4]) THEN
    RAISE EXCEPTION 'The solution must be in options text array!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_insert_solution_in_options_array
BEFORE INSERT ON public.questions
FOR EACH ROW
EXECUTE FUNCTION solution_in_options_array();

CREATE OR REPLACE TRIGGER trigger_update_solution_in_options_array
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION solution_in_options_array();


CREATE OR REPLACE TRIGGER trigger_insert_question_quiz_category
AFTER INSERT ON public.questions
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();

CREATE OR REPLACE TRIGGER trigger_update_question_quiz_category
AFTER UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();


INSERT INTO public.questions (text, category, imageURL, options, solution, quiz) VALUES 
('How much is tall the Eiffel Tower ?', 'France', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg', '{"71 meters", "72 meters", "1 meters", "100 meters"}', '71 meters', 1),
('How much is large the Giza Sphinx ?', 'Egypt', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg', '{"10 meters", "72 meters", "1 meters", "100 meters"}', '72 meters', 2),
('How much is 2 + 3 ?', 'Math', 'https://t3.ftcdn.net/jpg/04/83/90/18/360_F_483901821_46VsNR67uJC3xIKQN4aaxR6GtAZhx9G8.jpg', '{"5", "18", "0", "-2"}', '5', 3);


SELECT * from public.questions;

grant usage on schema "public" to anon;
grant usage on schema "public" to authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "public" TO anon;


SELECT * FROM pg_catalog.pg_tables  WHERE schemaname = 'public';

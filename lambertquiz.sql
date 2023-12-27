SELECT VERSION();

SELECT CURRENT_SCHEMA();

DROP SCHEMA IF EXISTS lambertquiz CASCADE;

CREATE SCHEMA IF NOT EXISTS lambertquiz AUTHORIZATION postgres;

COMMENT ON SCHEMA lambertquiz IS 'LambertQuiz App Schema';
	
SET SEARCH_PATH TO lambertquiz; 

SELECT CURRENT_DATABASE();

ALTER DATABASE postgres SET TIMEZONE TO 'Europe/Rome';

SELECT NOW();

DROP TYPE IF EXISTS categories;

CREATE TYPE categories AS ENUM ('France', 'Egypt', 'Math');

DROP EXTENSION IF EXISTS PGCRYPTO CASCADE;

CREATE EXTENSION IF NOT EXISTS PGCRYPTO;


--- Users:

DROP TABLE IF EXISTS lambertquiz.users;

CREATE TABLE IF NOT EXISTS lambertquiz.users (
	user_id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR ( 40 ) NOT NULL,
	password VARCHAR ( 72 ) NOT NULL,
  username VARCHAR ( 10 ) NOT NULL,
	inserted_at TIMESTAMP WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
  updated_at TIMESTAMP WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
  CONSTRAINT users_email_unique UNIQUE(email),
  CONSTRAINT users_username_unique UNIQUE(username)
);

COMMENT ON COLUMN lambertquiz.users.user_id IS 'The integer incremental User ID.';

COMMENT ON COLUMN lambertquiz.users.email IS 'The unique User account email.';

COMMENT ON COLUMN lambertquiz.users.password IS 'The non-unique User account password stored with the BF algorithm.';

COMMENT ON COLUMN lambertquiz.users.username IS 'The unique User account username.';

COMMENT ON COLUMN lambertquiz.users.inserted_at IS 'The TIMESTAMP date and time when the record was inserted.';

COMMENT ON COLUMN lambertquiz.users.updated_at IS 'The TIMESTAMP date and time when the record was updated.';

COMMENT ON TABLE lambertquiz.users IS 'LambertQuiz app Users table.';

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_unsigned_user_id CHECK (lambertquiz.users.user_id > 0);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_email_min_length CHECK (LENGTH(lambertquiz.users.email) >= 6);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_email_valid CHECK((lambertquiz.users.email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text));

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_password_min_length CHECK (LENGTH(lambertquiz.users.password) >= 16);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_username_min_length CHECK (LENGTH(lambertquiz.users.username) >= 3);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_inserted_at_updated_at CHECK (lambertquiz.users.inserted_at <= users.updated_at);

CREATE OR REPLACE FUNCTION user_updated_at_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+1 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_updated_at_set_timestamp
BEFORE UPDATE ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION user_updated_at_set_timestamp();

CREATE OR REPLACE FUNCTION crypt_user_password()
RETURNS TRIGGER AS $$
BEGIN
  NEW.password = CRYPT(NEW.password, GEN_SALT('BF'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_password_crypt_on_user_insert
BEFORE INSERT ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION crypt_user_password();

CREATE OR REPLACE TRIGGER trigger_password_crypt_on_user_update
BEFORE UPDATE ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION crypt_user_password();


INSERT INTO lambertquiz.users (email, password, username) VALUES ('matteolambertucci3@gmail.com', '12345678', 'Matt');


SELECT * FROM lambertquiz.users;



--- Quizzes

DROP TABLE IF EXISTS lambertquiz.quizzes;

CREATE TABLE IF NOT EXISTS lambertquiz.quizzes (
  quiz_id SERIAL NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category categories NOT NULL,
  CONSTRAINT quizzes_title_unique UNIQUE(title)
);

COMMENT ON COLUMN lambertquiz.quizzes.quiz_id IS 'The integer incremental Quiz ID.';

COMMENT ON COLUMN lambertquiz.quizzes.title IS 'The Quiz title.';

COMMENT ON COLUMN lambertquiz.quizzes.title IS 'The Quiz description.';

COMMENT ON COLUMN lambertquiz.quizzes.category IS 'The Quiz category in categories ENUM.';

COMMENT ON TABLE lambertquiz.quizzes IS 'LambertQuiz app Quizzes with questions and responses.';

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_unsigned_quiz_id CHECK (lambertquiz.quizzes.quiz_id > 0);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_title_min_length CHECK (LENGTH(lambertquiz.quizzes.title) >= 3);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_questions_description_min_length CHECK (LENGTH(lambertquiz.quizzes.description) >= 8);

ALTER TABLE lambertquiz.quizzes ADD CONSTRAINT check_quizzes_category_min_length CHECK (LENGTH(lambertquiz.quizzes.category::text) >= 3);

CREATE OR REPLACE FUNCTION quiz_question_category()
RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT COUNT(lambertquiz.quizzes.quiz_id) FROM lambertquiz.quizzes JOIN lambertquiz.questions ON lambertquiz.quizzes.quiz_id = lambertquiz.questions.quiz WHERE lambertquiz.quizzes.category <> lambertquiz.questions.category) > 0) THEN
 	RAISE EXCEPTION 'Question and Quiz with different category!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_quiz_question_category
AFTER UPDATE ON lambertquiz.quizzes
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();


INSERT INTO lambertquiz.quizzes (title, description, category) VALUES ('France culture Quiz', 'Simple Quiz on the France culture.', 'France'), ('Egypt culture Quiz', 'Simple Quiz on the Egypt culture.', 'Egypt'),  ('Math Quiz', 'Simple Math Quiz with simple calculations.', 'Math');


SELECT * FROM lambertquiz.quizzes;



--- Questions

DROP TABLE IF EXISTS lambertquiz.questions;

CREATE TABLE IF NOT EXISTS lambertquiz.questions (
  question_id SERIAL NOT NULL PRIMARY KEY,
  text TEXT NOT NULL,
  category categories NOT NULL,
  imageURL TEXT,
  options text ARRAY[4] NOT NULL,
  solution text NOT NULL,
  quiz integer NOT NULL,
  CONSTRAINT questions_text_category_unique UNIQUE(text, category),
  CONSTRAINT questions_imageURL_options_solution_quiz_unique UNIQUE(imageURL, options, solution, quiz),
  CONSTRAINT question_quiz_fk FOREIGN KEY(quiz) REFERENCES lambertquiz.quizzes(quiz_id) ON DELETE CASCADE
);

COMMENT ON COLUMN lambertquiz.questions.question_id IS 'The integer incremental quiz Question ID.';

COMMENT ON COLUMN lambertquiz.questions.text IS 'The quiz Question text.';

COMMENT ON COLUMN lambertquiz.questions.category IS 'The quiz Question category in categories ENUM.';

COMMENT ON COLUMN lambertquiz.questions.imageURL IS 'The quiz Question image URL (stored in my SUPABASE Storage).';

COMMENT ON COLUMN lambertquiz.questions.options IS 'The four quiz Question Options.';

COMMENT ON COLUMN lambertquiz.questions.solution IS 'The quiz Question response solution in options array.';

COMMENT ON COLUMN lambertquiz.questions.quiz IS 'The quiz Question foreign key.';

COMMENT ON TABLE lambertquiz.questions IS 'LambertQuiz app Questions with responses.';

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_unsigned_question_id CHECK (lambertquiz.questions.question_id > 0);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_text_min_length CHECK (LENGTH(lambertquiz.questions.text) >= 8);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_category_min_length CHECK (LENGTH(lambertquiz.questions.category::text) >= 3);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_imageURL_min_length CHECK (LENGTH(lambertquiz.questions.imageURL) >= 8);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_imageURL_valid CHECK((lambertquiz.questions.imageURL ~ '^[a-z](?:[-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~!\$&''\(\)\*\+,;=:@])|[\/\?])*)?'::text));

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_options_4_length CHECK (ARRAY_LENGTH(lambertquiz.questions.options, 1) = 4);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_option_min_length CHECK (LENGTH(lambertquiz.questions.solution) >= 1);

ALTER TABLE lambertquiz.questions ADD CONSTRAINT check_questions_unsigned_solution CHECK (lambertquiz.questions.quiz >= 0);


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
BEFORE INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION unique_options_array();

CREATE OR REPLACE TRIGGER trigger_update_unique_options_array
BEFORE UPDATE ON lambertquiz.questions
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
BEFORE INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION solution_in_options_array();

CREATE OR REPLACE TRIGGER trigger_update_solution_in_options_array
BEFORE UPDATE ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION solution_in_options_array();


CREATE OR REPLACE TRIGGER trigger_insert_question_quiz_category
AFTER INSERT ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();

CREATE OR REPLACE TRIGGER trigger_update_question_quiz_category
AFTER UPDATE ON lambertquiz.questions
FOR EACH ROW
EXECUTE FUNCTION quiz_question_category();

CREATE OR REPLACE FUNCTION get_random_questions(IN quiz_id INTEGER)
RETURNS SETOF questions
LANGUAGE SQL
AS $$
   SELECT * 
   FROM questions
   WHERE 
    quiz = quiz_id 
   ORDER BY RANDOM() ASC
   LIMIT 5;
$$;


INSERT INTO lambertquiz.questions (text, category, imageURL, options, solution, quiz) VALUES 
('How much is tall the Eiffel Tower ?', 'France', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/France/torre_eiffel.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9GcmFuY2UvdG9ycmVfZWlmZmVsLmpwZyIsImlhdCI6MTcwMjQxNTgxNSwiZXhwIjoxNzMzOTUxODE1fQ.5wYS0MP1lI-aVpscVg3Wv0TVPlWuhifEd2pQAfpTUIc&t=2023-12-12T21%3A16%3A57.369Z', '{"324 m", "72 m", "200 m", "100 m"}', '324 m', 1), ('What is the capital of the France ?', 'France', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/France/parigi-orig.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9GcmFuY2UvcGFyaWdpLW9yaWcuanBlZyIsImlhdCI6MTcwMjQxNTkxMywiZXhwIjoxNzMzOTUxOTEzfQ.e6yxVwOxNOHzoKu3AHQ-8A9Hg3HM8RYyOvUvwUERnyg&t=2023-12-12T21%3A18%3A34.638Z', '{"Rome", "Garbatella", "Chicago", "Paris"}', 'Paris', 1), ('What is the second city of the France ?', 'France', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/France/lione-cattedrale.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9GcmFuY2UvbGlvbmUtY2F0dGVkcmFsZS5qcGciLCJpYXQiOjE3MDI0MTU5NjksImV4cCI6MTczMzk1MTk2OX0.D6ZKWEay8ale7fAski9hsIYpHz3CIWLUoS4QrG6vZJo&t=2023-12-12T21%3A19%3A31.183Z', '{"Paris", "Tolosa", "Lione", "Nizza"}', 'Lione', 1), ('In what year was the Eiffel Tower built?', 'France', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/France/torre_eiffel.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9GcmFuY2UvdG9ycmVfZWlmZmVsLmpwZyIsImlhdCI6MTcwMjQxNTgxNSwiZXhwIjoxNzMzOTUxODE1fQ.5wYS0MP1lI-aVpscVg3Wv0TVPlWuhifEd2pQAfpTUIc&t=2023-12-12T21%3A16%3A57.369Z','{"1889", "2024", "0", "1911"}', '1889', 1), ('What is the French surface area?', 'France', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/France/_128316432_bbcmp_france.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9GcmFuY2UvXzEyODMxNjQzMl9iYmNtcF9mcmFuY2UucG5nIiwiaWF0IjoxNzAyNDE1OTkzLCJleHAiOjE3MzM5NTE5OTN9.Ee-dGxpJEmblQyf1VZrUkkdogi4mLP6zK8kPtZgLANg&t=2023-12-12T21%3A19%3A54.655Z', '{"851500 km^2", "551500 km^2", "0 km^2", "6001500 km^2"}', '551500 km^2', 1),
('How much is large the Giza Sphinx ?', 'Egypt', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Egypt/mistero_sfinge-scaled.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9FZ3lwdC9taXN0ZXJvX3NmaW5nZS1zY2FsZWQuanBlZyIsImlhdCI6MTcwMjQxNjI5MCwiZXhwIjoxNzMzOTUyMjkwfQ.xlr4WnV95OWE84Sk3U_UaB4ympVj50MjBZsiRE_zU9o&t=2023-12-12T21%3A24%3A52.090Z', '{"10 m", "6 m", "1 m", "324 m"}', '6 m', 2),  ('What is the capital of Egypt', 'Egypt', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Egypt/ll-Cairo-Egitto.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9FZ3lwdC9sbC1DYWlyby1FZ2l0dG8uanBnIiwiaWF0IjoxNzAyNDE2MjQ1LCJleHAiOjE3MzM5NTIyNDV9.GFmljKoy-yd-jUDZwvjhM67YlN2Ln8_qH60aIetaD4M&t=2023-12-12T21%3A24%3A07.374Z',  '{"Il Cairo", "Piramide", "Luxor", "Giza"}', 'Il Cairo', 2), ('What is the Egypt surface area?', 'Egypt', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Egypt/mappa_egitto.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9FZ3lwdC9tYXBwYV9lZ2l0dG8uanBnIiwiaWF0IjoxNzAyNDE2MjY2LCJleHAiOjE3MzM5NTIyNjZ9.xU8f3G_OH55vxKhN53HHypTP-ax_ABxcg3lzUVpMOhA&t=2023-12-12T21%3A24%3A27.749Z', '{"1002000 km^2", "551500 km^2", "0 km^2", "6001500 km^2"}', '1002000 km^2', 2), ('When did ancient Egypt originate?', 'Egypt', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Egypt/antico_egitto.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9FZ3lwdC9hbnRpY29fZWdpdHRvLmpwZyIsImlhdCI6MTcwMjQxNjE3MywiZXhwIjoxNzMzOTUyMTczfQ.2rMtK9j8ASy0OCENTtVH2WWKmDWgP-2CWS0BY1b11Is&t=2023-12-12T21%3A22%3A55.243Z', '{"3900 AC", "3942 AC", "0", "342 DC"}', '3900 AC', 2), ('How many colors does the Egyptian flag have?', 'Egypt', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Egypt/bandiera_egitto.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9FZ3lwdC9iYW5kaWVyYV9lZ2l0dG8ucG5nIiwiaWF0IjoxNzAyNDE2MjA2LCJleHAiOjE3MzM5NTIyMDZ9.-kg1La3IlUng4EzehoX3SJU9XvHMPizuslOsYs-2rWU&t=2023-12-12T21%3A23%3A27.569Z', '{"1", "2", "3", "4"}', '4', 2),
('How much is 2 plus 3 ?', 'Math', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/algebra.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL2FsZ2VicmEuanBnIiwiaWF0IjoxNzAyNDE2MzMxLCJleHAiOjE3MzM5NTIzMzF9.bKJaGd-lO9n_CtZkXiReBedGji3iiEptsEyWoHtdI9U&t=2023-12-12T21%3A25%3A33.008Z', '{"5", "18", "0", "-2"}', '5', 3), ('10 minus 4 is equals to', 'Math', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkuanBnIiwiaWF0IjoxNzAyNDE2MzYyLCJleHAiOjE3MzM5NTIzNjJ9.-a1oeLGZvtVqPhFw6jUKCDmS7Gi3NW3zcDZA1ShaUpg&t=2023-12-12T21%3A26%3A04.180Z', '{"6", "-6", "5", "0"}', '6', 3), ('60 times of 8 equals to', 'Math', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkyLnBuZyIsImlhdCI6MTcwMjU3NzQwMCwiZXhwIjoxNzM0MTEzNDAwfQ.-RGeX9w3ZGlR9GNK6wy2Qjce4wUndvGN4ma07DxG6ag&t=2023-12-14T18%3A10%3A00.948Z', '{"6", "0", "-3", "480"}', '480', 3), ('121 Divided by 11 is equals to', 'Math', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkzLmpwZyIsImlhdCI6MTcwMjU3NzQzMSwiZXhwIjoxNzM0MTEzNDMxfQ.62f75RCfrex2s8TJnPCEuI_g-yoUlMCXn_M1XIGyx6Q&t=2023-12-14T18%3A10%3A32.063Z', '{"10", "18", "-3", "11"}', '11', 3),
('3 raised to the 3 is equals to', 'Math', 'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/potenza.gif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3BvdGVuemEuZ2lmIiwiaWF0IjoxNzAyNTA0NzkxLCJleHAiOjE3MzQwNDA3OTF9.b0QrIDSLFLqP6boYfGWnzukgDixznsEJZ82SsBkLR00&t=2023-12-13T21%3A59%3A53.286Z', '{"3", "1", "27", "0"}', '27', 3);


SELECT * from lambertquiz.questions;


--- Progresses

CREATE TABLE IF NOT EXISTS lambertquiz.progresses (
  progresses_id SERIAL NOT NULL PRIMARY KEY,
  _user INTEGER NOT NULL,
  quiz INTEGER NOT NULL,
  quiz_started_at TIMESTAMP NOT NULL,
  quiz_finished_at TIMESTAMP NOT NULL,
  inserted_at TIMESTAMP WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
  updated_at TIMESTAMP WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
  CONSTRAINT progresses__user_quiz_unique UNIQUE(_user, quiz, quiz_started_at),
  CONSTRAINT progresses_user_fk FOREIGN KEY(_user) REFERENCES lambertquiz.users(user_id) ON DELETE CASCADE,
  CONSTRAINT progresses_quiz_fk FOREIGN KEY(quiz) REFERENCES lambertquiz.quizzes(quiz_id) ON DELETE CASCADE
);

COMMENT ON COLUMN lambertquiz.progresses.progresses_id IS 'The integer incremental progresses ID.';

COMMENT ON COLUMN lambertquiz.progresses._user IS 'The user quiz question foreign key.';

COMMENT ON COLUMN lambertquiz.progresses.quiz IS 'The quiz question foreign key.';

COMMENT ON COLUMN lambertquiz.progresses.quiz_started_at IS 'The quiz start timestamp.';

COMMENT ON COLUMN public.progresses.quiz_finished_at IS 'The quiz end timestamp.';

COMMENT ON COLUMN lambertquiz.progresses.inserted_at IS 'The TIMESTAMP date and time when the record was inserted.';

COMMENT ON COLUMN lambertquiz.progresses.updated_at IS 'The TIMESTAMP date and time when the record was updated.';

COMMENT ON TABLE lambertquiz.progresses IS 'LambertQuiz app table that rappresents the quizzes played by a specific user, used for statistics.';

ALTER TABLE public.progresses ADD CONSTRAINT check_progresses_started_at_inserted_at_updated_at CHECK (public.progresses.quiz_started_at < progresses.inserted_at AND public.progresses.quiz_started_at < progresses.updated_at AND public.progresses.quiz_started_at < public.progresses.quiz_finished_at);

ALTER TABLE public.progresses ADD CONSTRAINT check_progresses_finished_at_inserted_at_updated_at CHECK (public.progresses.quiz_finished_at < progresses.inserted_at AND public.progresses.quiz_started_at < progresses.updated_at AND public.progresses.quiz_finished_at > public.progresses.quiz_started_at);

ALTER TABLE lambertquiz.progresses ADD CONSTRAINT check_progresses_started_at_inserted_at_updated_at CHECK (lambertquiz.progresses.quiz_started_at < progresses.inserted_at AND lambertquiz.progresses.quiz_started_at < progresses.updated_at);

ALTER TABLE lambertquiz.progresses ADD CONSTRAINT check_progresses_inserted_at_updated_at CHECK (lambertquiz.progresses.inserted_at <= progresses.updated_at);

CREATE OR REPLACE FUNCTION progresses_updated_at_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+1 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_progresses_updated_at_set_timestamp
BEFORE UPDATE ON lambertquiz.progresses
FOR EACH ROW
EXECUTE FUNCTION progresses_updated_at_set_timestamp();

INSERT INTO progresses (_user, quiz, quiz_started_at, quiz_finished_at) VALUES (1, 1, '2023-12-23 10:23:54', '2023-12-23 10:24:32');

SELECT * FROM progresses;

GRANT usage ON schema "lambertquiz" TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "lambertquiz" TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA lambertquiz TO postgres;


--- You must have the auth schema:

CREATE OR REPLACE FUNCTION delete_user()
RETURNS VOID
LANGUAGE SQL SECURITY DEFINER 
AS $$
  DELETE FROM auth.users 
  WHERE id = auth.UID();
$$;



SELECT * FROM pg_catalog.pg_tables  WHERE schemaname = 'lambertquiz';

-- Example query:
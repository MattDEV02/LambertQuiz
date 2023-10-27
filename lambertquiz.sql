SELECT VERSION();

SELECT CURRENT_SCHEMA();

DROP SCHEMA IF EXISTS lambertquiz CASCADE;

CREATE SCHEMA IF NOT EXISTS lambertquiz AUTHORIZATION postgres;

COMMENT ON SCHEMA lambertquiz IS 'LambertQuiz App Schema';

SET SEARCH_PATH TO lambertquiz; 

SET TIME ZONE 'Europe/Rome';

SELECT NOW();

DROP TYPE IF EXISTS categories;

CREATE TYPE categories AS ENUM ('France', 'Egypt', 'Math');

DROP EXTENSION IF EXISTS PGCRYPTO CASCADE;

CREATE EXTENSION IF NOT EXISTS PGCRYPTO;


--- Users:

DROP TABLE IF EXISTS lambertquiz.users;

CREATE TABLE IF NOT EXISTS lambertquiz.users (
	user_id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR ( 40 ) UNIQUE NOT NULL,
	password VARCHAR ( 72 ) NOT NULL,
  username VARCHAR ( 10 ) UNIQUE NOT NULL,
	inserted_at timestamp WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+2 hours') NOT NULL,
  updated_at timestamp WITH time zone DEFAULT TIMEZONE('UTC'::text, NOW() + INTERVAL '+2 hours') NOT NULL
);

COMMENT ON COLUMN lambertquiz.users.user_id IS 'The integer incremental User ID.';

COMMENT ON COLUMN lambertquiz.users.email IS 'The unique User account email.';

COMMENT ON COLUMN lambertquiz.users.password IS 'The non-unique User account password stored with the BF algorithm.';

COMMENT ON COLUMN lambertquiz.users.username IS 'The unique User account username.';

COMMENT ON COLUMN lambertquiz.users.inserted_at IS 'The timestamp date and time when the record was inserted.';

COMMENT ON COLUMN lambertquiz.users.updated_at IS 'The timestamp date and time when the record was updated.';

COMMENT ON TABLE lambertquiz.users IS 'lambertquiz app Users table.';

CREATE OR REPLACE FUNCTION user_updated_at_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+2 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_user_updated_at_set_timestamp
BEFORE UPDATE ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION user_updated_at_set_timestamp();

CREATE OR REPLACE FUNCTION password_crypt_on_user_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.password = CRYPT(NEW.password, GEN_SALT('BF'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_password_crypt_on_user_insert
BEFORE INSERT ON lambertquiz.users
FOR EACH ROW
EXECUTE FUNCTION password_crypt_on_user_insert();

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_unsigned_user_id CHECK (lambertquiz.users.user_id > 0);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_email_min_length CHECK (LENGTH(lambertquiz.users.email) >= 6);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_email_valid CHECK((lambertquiz.users.email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text));

--ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_password_min_length CHECK (LENGTH(lambertquiz.users.password) >= 16);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_username_min_length CHECK (LENGTH(lambertquiz.users.username) >= 3);

ALTER TABLE lambertquiz.users ADD CONSTRAINT check_users_inserted_at_updated_at CHECK (lambertquiz.users.inserted_at <= users.updated_at);

--INSERT INTO lambertquiz.users (email, password, username) VALUES ('matteolambertucci3@gmail.com', CRYPT('12345678', GEN_SALT('BF')), 'Matt');

--('gattoyu@gmail.com', CRYPT('12345678', GEN_SALT('BF')), 'Gattissimo');

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

COMMENT ON TABLE lambertquiz.quizzes IS 'lambertquiz app Quizzes with questions and responses.';

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

INSERT INTO lambertquiz.quizzes (title, description, category) VALUES ('France culture Quiz', 'Simple Quiz on the France culture', 'France'), ('Egypt culture Quiz', 'Simple Quiz on the Egypt culture', 'Egypt'),  ('Math Quiz', 'Simple Math Quiz with simple calculations.', 'Math');


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
  UNIQUE(text, category),
  UNIQUE(imageURL, options, solution, quiz),
  CONSTRAINT question_quiz_fk FOREIGN KEY(quiz) REFERENCES lambertquiz.quizzes(quiz_id) ON DELETE CASCADE
);

COMMENT ON COLUMN lambertquiz.questions.question_id IS 'The integer incremental quiz Question ID.';

COMMENT ON COLUMN lambertquiz.questions.text IS 'The quiz Question text.';

COMMENT ON COLUMN lambertquiz.questions.category IS 'The quiz Question category in categories ENUM.';

COMMENT ON COLUMN lambertquiz.questions.imageURL IS 'The quiz Question image URL.';

COMMENT ON COLUMN lambertquiz.questions.options IS 'The four quiz Question Options.';

COMMENT ON COLUMN lambertquiz.questions.solution IS 'The quiz Question response solution in options array.';

COMMENT ON TABLE lambertquiz.questions IS 'lambertquiz app Questions with responses.';

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


INSERT INTO lambertquiz.questions (text, category, imageURL, options, solution, quiz) VALUES 
('How much is tall the Eiffel Tower ?', 'France', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg', '{"324 m", "72 m", "200 m", "100 m"}', '324 m', 1), ('What is the capital of the France ?', 'France', 'https://cdn.studenti.stbm.it/images/2018/10/15/parigi-orig.jpeg', '{"Rome", "Garbatella", "Chicago", "Paris"}', 'Paris', 1), ('What is the second city of the France ?', 'France', 'https://www.franciaturismo.net/wp-content/uploads/sites/4/lione-cattedrale.jpg', '{"Paris", "Tolosa", "Lione", "Nizza"}', 'Lione', 1), ('In what year was the Eiffel Tower built?', 'France', 'https://res.cloudinary.com/hello-tickets/image/upload/ar_1:1,c_fill,f_auto,q_auto,w_800/v1645844269/gd99ktjpmrtkwwlyn8hx.jpg','{"1889", "2024", "0", "1911"}', '1889', 1), ('What is the French surface area?', 'France', 'https://ichef.bbci.co.uk/news/1024/branded_news/5BA5/production/_128316432_bbcmp_france.png', '{"851500 km^2", "551500 km^2", "0 km^2", "6001500 km^2"}', '551500 km^2', 1),
('How much is large the Giza Sphinx ?', 'Egypt', 'https://www.guidaconsumatore.com/wp-content/uploads/2022/06/mistero_sfinge-scaled.jpeg', '{"10 m", "6 m", "1 m", "324 m"}', '6 m', 2),  ('What is the capital of Egypt', 'Egypt', 'https://www.egittosharmelsheikh.it/wp-content/uploads/2021/05/ll-Cairo-Egitto.jpg',  '{"Il Cairo", "Piramide", "Luxor", "Giza"}', 'Il Cairo', 2), ('What is the Egypt surface area?', 'Egypt', 'https://us.123rf.com/450wm/harvepino/harvepino1611/harvepino161100200/66303868-mappa-dell-egitto-con-bandiera-incorporata-sulla-superficie-del-pianeta-illustrazione-3d.jpg', '{"1002000 km^2", "551500 km^2", "0 km^2", "-6001500 km^2"}', '1002000 km^2', 2), ('When did ancient Egypt originate?', 'Egypt', 'https://www.aristidegabelli.edu.it/wp-content/uploads/archivio-images/egitto1.jpg', '{"3900 AC", "3942 AC", "0", "342 DC"}', '3900 AC', 2), ('How many colors does the Egyptian flag have?', 'Egypt', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/2000px-Flag_of_Egypt.svg.png', '{"1", "2", "3", "4"}', '4', 2),
('How much is 2 + 3 ?', 'Math', 'https://t3.ftcdn.net/jpg/04/83/90/18/360_F_483901821_46VsNR67uJC3xIKQN4aaxR6GtAZhx9G8.jpg', '{"5", "18", "0", "-2"}', '5', 3), ('10 minus 4 is equals to', 'Math', 'https://thumbs.dreamstime.com/z/matematica-con-moltiplicazione-di-sottrazione-e-simboli-divisione-bianco-sfondo-immagine-illustrazione-della-generata-da-225369255.jpg', '{"6", "-6", "5", "0"}', '6', 3), ('60 times of 8 equals to', 'Math', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Basic_arithmetic_operators.svg/440px-Basic_arithmetic_operators.svg.png', '{"6", "0", "-3", "480"}', '480', 3), ('121 Divided by 11 is equals to', 'Math', 'https://modo3.com/thumbs/fit630x300/253965/1629615873/%D9%83%D8%AA%D8%A7%D8%A8%D8%A9_%D9%85%D8%B9%D8%A7%D8%AF%D9%84%D8%A7%D8%AA_%D8%A7%D9%84%D8%AC%D9%85%D8%B9_%D9%88%D8%A7%D9%84%D8%B7%D8%B1%D8%AD_%D9%88%D8%AD%D9%84%D9%91%D9%87%D8%A7.jpg', '{"10", "18", "-3", "11"}', '11', 3),
('3 raised to the 3 is equals to', 'Math', 'https://www.laboo.biz/articoli/potenza-di-potenza.gif', '{"3", "1", "27", "0"}', '27', 3);


SELECT * from lambertquiz.questions;

GRANT usage ON schema "lambertquiz" TO postgres;
GRANT usage ON schema "lambertquiz" TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "lambertquiz" TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "lambertquiz" TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA lambertquiz TO postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA lambertquiz TO postgres;

SELECT * FROM pg_catalog.pg_tables  WHERE schemaname = 'lambertquiz';
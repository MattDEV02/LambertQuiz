SELECT
  VERSION();

SELECT
  CURRENT_SCHEMA();

DROP SCHEMA
  IF EXISTS public CASCADE;

CREATE SCHEMA
  IF NOT EXISTS public AUTHORIZATION postgres;

COMMENT
  ON SCHEMA public IS 'LambertQuiz App Schema';

SET
  SEARCH_PATH TO public;

SELECT
  CURRENT_DATABASE();

ALTER DATABASE
  postgres
SET
  TIMEZONE TO 'Europe/Rome';

SELECT
  NOW();

DROP TYPE
  IF EXISTS categories;

CREATE TYPE
  categories AS ENUM(
    'Egypt',
    'England',
    'France',
    'Geography',
    'History',
    'Math'
  );

DROP EXTENSION
  IF EXISTS PGCRYPTO CASCADE;

CREATE EXTENSION
  IF NOT EXISTS PGCRYPTO;

--- Users:
DROP TABLE IF EXISTS
  public.users;

CREATE TABLE IF NOT EXISTS
  public.users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(72) NOT NULL,
    username VARCHAR(10) NOT NULL,
    inserted_at TIMESTAMP WITH time zone DEFAULT TIMEZONE ('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
    updated_at TIMESTAMP WITH time zone DEFAULT TIMEZONE ('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_username_unique UNIQUE (username)
  );

COMMENT
  ON COLUMN public.users.user_id IS 'The integer incremental User ID.';

COMMENT
  ON COLUMN public.users.email IS 'The unique User account email.';

COMMENT
  ON COLUMN public.users.password IS 'The non-unique User account password stored with the BF algorithm.';

COMMENT
  ON COLUMN public.users.username IS 'The unique User account username.';

COMMENT
  ON COLUMN public.users.inserted_at IS 'The TIMESTAMP date and time when the record was inserted.';

COMMENT
  ON COLUMN public.users.updated_at IS 'The TIMESTAMP date and time when the record was updated.';

COMMENT
  ON TABLE public.users IS 'LambertQuiz app Users table.';

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_unsigned_user_id CHECK (public.users.user_id > 0);

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_email_min_length CHECK (LENGTH(public.users.email) >= 6);

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_email_valid CHECK (
    (
      public.users.email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text
    )
  );

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_password_min_length CHECK (LENGTH(public.users.password) >= 16);

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_username_min_length CHECK (LENGTH(public.users.username) >= 3);

ALTER TABLE
  public.users
ADD
  CONSTRAINT check_users_inserted_at_updated_at CHECK (public.users.inserted_at <= users.updated_at);

CREATE
OR REPLACE FUNCTION user_updated_at_set_timestamp () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+1 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_user_updated_at_set_timestamp BEFORE
UPDATE
  ON public.users FOR EACH ROW
EXECUTE
  FUNCTION user_updated_at_set_timestamp ();

CREATE
OR REPLACE FUNCTION crypt_user_password () RETURNS TRIGGER AS $$
BEGIN
  NEW.password = CRYPT(NEW.password, GEN_SALT('BF'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_password_crypt_on_user_insert BEFORE INSERT ON public.users FOR EACH ROW
EXECUTE
  FUNCTION crypt_user_password ();

CREATE
OR REPLACE TRIGGER trigger_password_crypt_on_user_update BEFORE
UPDATE
  ON public.users FOR EACH ROW
EXECUTE
  FUNCTION crypt_user_password ();

CREATE
OR REPLACE FUNCTION check_user_password_function (input_email VARCHAR, input_password TEXT) RETURNS BOOLEAN AS $$
DECLARE
    _check BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 
            user_id 
        FROM 
            Users
        WHERE 
            email = email AND 
            password = CRYPT(input_password, password)
    ) INTO _check;
    RETURN _check;
END;
$$ LANGUAGE PLPGSQL;

CREATE INDEX
  users_index ON public.users USING btree (user_id);

/*
INSERT INTO
  public.users (email, password, username)
VALUES
  (
    'matteolambertucci3@gmail.com',
    'Matteo02',
    'Matt'
  );

*/

SELECT
  *
FROM
  public.users;

--- Quizzes
DROP TABLE IF EXISTS
  public.quizzes;

CREATE TABLE IF NOT EXISTS
  public.quizzes (
    quiz_id SERIAL NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category categories NOT NULL,
    CONSTRAINT quizzes_title_unique UNIQUE (title)
  );

COMMENT
  ON COLUMN public.quizzes.quiz_id IS 'The integer incremental Quiz ID.';

COMMENT
  ON COLUMN public.quizzes.title IS 'The Quiz title.';

COMMENT
  ON COLUMN public.quizzes.title IS 'The Quiz description.';

COMMENT
  ON COLUMN public.quizzes.category IS 'The Quiz category in categories ENUM.';

COMMENT
  ON TABLE public.quizzes IS 'LambertQuiz app Quizzes with questions and responses.';

ALTER TABLE
  public.quizzes
ADD
  CONSTRAINT check_quizzes_unsigned_quiz_id CHECK (public.quizzes.quiz_id > 0);

ALTER TABLE
  public.quizzes
ADD
  CONSTRAINT check_quizzes_title_min_length CHECK (LENGTH(public.quizzes.title) >= 3);

ALTER TABLE
  public.quizzes
ADD
  CONSTRAINT check_questions_description_min_length CHECK (LENGTH(public.quizzes.description) >= 8);

ALTER TABLE
  public.quizzes
ADD
  CONSTRAINT check_quizzes_category_min_length CHECK (LENGTH(public.quizzes.category::text) >= 3);

CREATE
OR REPLACE FUNCTION quiz_question_category () RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT COUNT(public.quizzes.quiz_id) FROM public.quizzes JOIN public.questions ON public.quizzes.quiz_id = public.questions.quiz WHERE public.quizzes.category <> public.questions.category) > 0) THEN
 	RAISE EXCEPTION 'Question and Quiz with different category!' ;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_update_quiz_question_category
AFTER
UPDATE
  ON public.quizzes FOR EACH ROW
EXECUTE
  FUNCTION quiz_question_category ();

CREATE INDEX
  quizzes_index ON public.quizzes USING btree (quiz_id);

INSERT INTO
  public.quizzes (title, description, category)
VALUES
  (
    'Egypt culture Quiz',
    'Simple Quiz on the Egypt culture.',
    'Egypt'
  ),
  (
    'England culture Quiz',
    'Simple Quiz on the England culture.',
    'England'
  ),
  (
    'France culture Quiz',
    'Simple Quiz on the France culture.',
    'France'
  ),
  (
    'Geography Quiz',
    'Simple Quiz on Geography.',
    'Geography'
  ),
  (
    'History Quiz',
    'Simple Quiz on History.',
    'History'
  ),
  (
    'Math Quiz',
    'Simple Math Quiz with simple calculations.',
    'Math'
  );

SELECT
  *
FROM
  public.quizzes;

--- Questions
DROP TABLE IF EXISTS
  public.questions;

CREATE TABLE IF NOT EXISTS
  public.questions (
    question_id SERIAL NOT NULL PRIMARY KEY,
    text TEXT NOT NULL,
    category categories NOT NULL,
    imageURL TEXT,
    options text ARRAY[4] NOT NULL,
    solution text NOT NULL,
    quiz integer NOT NULL,
    CONSTRAINT questions_text_category_unique UNIQUE (text, category),
    CONSTRAINT questions_imageURL_options_solution_quiz_unique UNIQUE (imageURL, options, solution, quiz),
    CONSTRAINT question_quiz_fk FOREIGN KEY (quiz) REFERENCES public.quizzes (quiz_id) ON DELETE CASCADE
  );

COMMENT
  ON COLUMN public.questions.question_id IS 'The integer incremental quiz Question ID.';

COMMENT
  ON COLUMN public.questions.text IS 'The quiz Question text.';

COMMENT
  ON COLUMN public.questions.category IS 'The quiz Question category in categories ENUM.';

COMMENT
  ON COLUMN public.questions.imageURL IS 'The quiz Question image URL (stored in my SUPABASE Storage).';

COMMENT
  ON COLUMN public.questions.options IS 'The four quiz Question Options.';

COMMENT
  ON COLUMN public.questions.solution IS 'The quiz Question response solution in options array.';

COMMENT
  ON COLUMN public.questions.quiz IS 'The quiz Question foreign key.';

COMMENT
  ON TABLE public.questions IS 'LambertQuiz app Questions with responses.';

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_unsigned_question_id CHECK (public.questions.question_id > 0);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_text_min_length CHECK (LENGTH(public.questions.text) >= 8);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_category_min_length CHECK (LENGTH(public.questions.category::text) >= 3);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_imageURL_min_length CHECK (LENGTH(public.questions.imageURL) >= 8);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_imageURL_valid CHECK (
    (
      public.questions.imageURL ~ '^[a-z](?:[-a-z0-9\+\.])*:(?:\/\/(?:(?:%[0-9a-f][0-9a-f]|[-a-z0-9\._~!\$&''\(\)\*\+,;=:@])|[\/\?])*)?'::text
    )
  );

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_options_4_length CHECK (ARRAY_LENGTH(public.questions.options, 1) = 4);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_option_min_length CHECK (LENGTH(public.questions.solution) >= 1);

ALTER TABLE
  public.questions
ADD
  CONSTRAINT check_questions_unsigned_solution CHECK (public.questions.quiz >= 0);

CREATE
OR REPLACE FUNCTION unique_options_array () RETURNS TRIGGER AS $$
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

CREATE
OR REPLACE TRIGGER trigger_insert_unique_options_array BEFORE INSERT ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION unique_options_array ();

CREATE
OR REPLACE TRIGGER trigger_update_unique_options_array BEFORE
UPDATE
  ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION unique_options_array ();

CREATE
OR REPLACE FUNCTION solution_in_options_array () RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.solution != NEW.options[1] AND NEW.solution != NEW.options[2] AND NEW.solution != NEW.options[3] AND NEW.solution != NEW.options[4]) THEN
    RAISE EXCEPTION 'The solution must be in options text array!';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_insert_solution_in_options_array BEFORE INSERT ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION solution_in_options_array ();

CREATE
OR REPLACE TRIGGER trigger_update_solution_in_options_array BEFORE
UPDATE
  ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION solution_in_options_array ();

CREATE
OR REPLACE TRIGGER trigger_insert_question_quiz_category
AFTER
  INSERT ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION quiz_question_category ();

CREATE
OR REPLACE TRIGGER trigger_update_question_quiz_category
AFTER
UPDATE
  ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION quiz_question_category ();

CREATE
OR REPLACE FUNCTION quiz_question_five () RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT COUNT(public.questions.question_id) FROM public.questions WHERE public.questions.quiz = NEW.quiz) >= 5) THEN
 	RAISE EXCEPTION 'Maximum 5 questions per Quiz!' ;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_question_category_five BEFORE INSERT ON public.questions FOR EACH ROW
EXECUTE
  FUNCTION quiz_question_five ();

CREATE
OR REPLACE FUNCTION get_random_questions (IN quiz_id INTEGER) RETURNS SETOF questions LANGUAGE SQL AS $$
   SELECT * 
   FROM questions
   WHERE 
    quiz = quiz_id 
   ORDER BY RANDOM() ASC
   LIMIT 5;
$$;

CREATE INDEX
  questions_index ON public.questions USING btree (question_id);

INSERT INTO
  public.questions (text, category, imageURL, options, solution, quiz)
VALUES
  (
    'How much is large the Giza Sphinx ?',
    'Egypt',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Egypt/sfinge.jpeg?t=2024-01-11T13%3A48%3A40.330Z',
    '{"10 m", "6 m", "1 m", "324 m"}',
    '6 m',
    1
  ),
  (
    'What is the capital of Egypt',
    'Egypt',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Egypt/Cairo.jpg?t=2024-01-11T13%3A49%3A34.623Z',
    '{"Il Cairo", "Piramide", "Luxor", "Giza"}',
    'Il Cairo',
    1
  ),
  (
    'What is the Egypt surface area?',
    'Egypt',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Egypt/mappa_egitto.jpg?t=2024-01-11T13%3A49%3A15.469Z',
    '{"1002000 km^2", "551500 km^2", "0 km^2", "6001500 km^2"}',
    '1002000 km^2',
    1
  ),
  (
    'When did ancient Egypt originate?',
    'Egypt',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Egypt/antico_egitto.jpg?t=2024-01-11T13%3A49%3A50.994Z',
    '{"3900 AC", "3942 AC", "0", "342 DC"}',
    '3900 AC',
    1
  ),
  (
    'How many colors does the Egyptian flag have ?',
    'Egypt',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Egypt/bandiera_egitto.png?t=2024-01-11T13%3A49%3A06.781Z',
    '{"1", "2", "3", "4"}',
    '4',
    1
  ),
  (
    'When did Queen Elizabeth die ?',
    'England',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/England/Queen_Elizabeth.jpg?t=2024-01-11T11%3A49%3A49.686Z',
    '{"2024", "yesterday", "2023", "1999"}',
    '2023',
    2
  ),
  (
    'What is the Englanld surface area ?',
    'England',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/England/england-map.jpg?t=2024-01-11T11%3A51%3A57.771Z',
    '{"140279 km^2", "130279 km^2", "250898 km^2", "0 km^2"}',
    '130279 km^2',
    2
  ),
  (
    'What is drawn on the English flag?',
    'England',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/England/england_flag.png?t=2024-01-11T11%3A53%3A39.949Z',
    '{"A ball", "A crown", "An animal", "A cross"}',
    'A cross',
    2
  ),
  (
    'What is the capital of England ?',
    'England',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/England/london.jpeg?t=2024-01-12T08%3A55%3A06.769Z',
    '{"London", "Frosinone", "Rome", "Liverpool"}',
    'London',
    2
  ),
  (
    'How tall is the tower bridge ?',
    'England',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/England/tower_bridge.jpg?t=2024-01-11T11%3A59%3A59.484Z',
    '{"65 m", "70 m", "289 m", "0 m"}',
    '65 m',
    2
  ),
  (
    'How much is tall the Eiffel Tower ?',
    'France',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/France/torre_eiffel.jpg?t=2024-01-11T13%3A50%3A23.804Z',
    '{"324 m", "72 m", "200 m", "100 m"}',
    '324 m',
    3
  ),
  (
    'What is the capital of the France ?',
    'France',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/France/torre_eiffel.jpg?t=2024-01-11T13%3A50%3A23.804Z',
    '{"Rome", "Garbatella", "Chicago", "Paris"}',
    'Paris',
    3
  ),
  (
    'What is the second city of the France ?',
    'France',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/France/lione.jpg',
    '{"Paris", "Tolosa", "Lione", "Nizza"}',
    'Lione',
    3
  ),
  (
    'In what year was the Eiffel Tower built?',
    'France',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/France/torre_eiffel.jpg?t=2024-01-11T13%3A50%3A23.804Z',
    '{"1889", "2024", "0", "1911"}',
    '1889',
    3
  ),
  (
    'What is the French surface area?',
    'France',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/France/mappa_francia.png?t=2024-01-11T13%3A52%3A13.480Z',
    '{"851500 km^2", "551500 km^2", "0 km^2", "6001500 km^2"}',
    '551500 km^2',
    3
  ),
  (
    'What is the Germany surface area?',
    'Geography',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Geography/germania-mappa.jpg?t=2024-01-11T12%3A04%3A16.486Z',
    '{"851500 km^2", "357592 km^2", "0 km^2", "457592 km^2"}',
    '357592 km^2',
    4
  ),
  (
    'How many cultures does India have?',
    'Geography',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Geography/induismo.jpg?t=2024-01-11T12%3A06%3A59.256Z',
    '{"4", "1", "0", "-2"}',
    '4',
    4
  ),
  (
    'What is the population of Islanda ?',
    'Geography',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Geography/islanda.jpg?t=2024-01-12T08%3A56%3A56.132Z',
    '{"472520 people", "0 people", "-100 people", "372520 people"}',
    '372520 people',
    4
  ),
  (
    'Who does Morocco NOT border with?',
    'Geography',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Geography/mappa-marocco.jpg?t=2024-01-11T12%3A11%3A47.736Z',
    '{"Algeria", "Sahara Desert", "Sweden", "Mediterranean Sea"}',
    'Sweden',
    4
  ),
  (
    'How much is the Italian PIL worth?',
    'Geography',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/Geography/pil_italiano.jpg?t=2024-01-12T08%3A56%3A38.433Z',
    '{"0 trillion USD", "1,108 trillion USD", "2,108 trillion USD", "3,108 trillion USD"}',
    '2,108 trillion USD',
    4
  ),
  (
    'Who invented the famous formula for calculating the sum of the first n natural numbers n * (n + 1) / 2?',
    'History',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/History/Gauss.jpg',
    '{"Garibaldi", "Gauss", "Totti", "Kennedy"}',
    'Gauss',
    5
  ),
  (
    'In what period of time did the Roman Empire dominate the Mediterranean and Central Europe?',
    'History',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/History/impero_romano.png?t=2024-01-11T13%3A38%3A24.858Z',
    '{"1000 AC - 2000 DC", "1453 AC - 0", "753 AC - 1453 DC", "0 - 1453 DC"}',
    '753 AC - 1453 DC',
    5
  ),
  (
    'When did the First World War begin?',
    'History',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/History/prima_guerra_mondiale.jpg',
    '{"1900", "1939", "1910", "1914"}',
    '1914',
    5
  ),
  (
    'When did the Second World War end?',
    'History',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/History/seconda-guerra-mondiale.jpg?t=2024-01-11T13%3A43%3A06.048Z',
    '{"1935", "1929", "1945", "1941"}',
    '1945',
    5
  ),
  (
    'Who discovered America?',
    'History',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/public/LambertQuiz/History/scoperta_america.jpg?t=2024-01-11T13%3A45%3A20.817Z',
    '{"Cristoforo Colombo", "Amerigo Vespucci", "Roosevelt", "Giulio Cesare"}',
    'Cristoforo Colombo',
    5
  ),
  (
    '2 plus 3 is equals to',
    'Math',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkuanBnIiwiaWF0IjoxNzAyNDE2MzYyLCJleHAiOjE3MzM5NTIzNjJ9.-a1oeLGZvtVqPhFw6jUKCDmS7Gi3NW3zcDZA1ShaUpg&t=2023-12-12T21%3A26%3A04.180Z',
    '{"0", "5", "-5", "6"}',
    '5',
    6
  ),
  (
    '10 minus 4 is equals to',
    'Math',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkuanBnIiwiaWF0IjoxNzAyNDE2MzYyLCJleHAiOjE3MzM5NTIzNjJ9.-a1oeLGZvtVqPhFw6jUKCDmS7Gi3NW3zcDZA1ShaUpg&t=2023-12-12T21%3A26%3A04.180Z',
    '{"6", "-6", "5", "0"}',
    '6',
    6
  ),
  (
    '60 times of 8 equals to',
    'Math',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkyLnBuZyIsImlhdCI6MTcwMjU3NzQwMCwiZXhwIjoxNzM0MTEzNDAwfQ.-RGeX9w3ZGlR9GNK6wy2Qjce4wUndvGN4ma07DxG6ag&t=2023-12-14T18%3A10%3A00.948Z',
    '{"6", "0", "-3", "480"}',
    '480',
    6
  ),
  (
    '121 Divided by 11 is equals to',
    'Math',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/simboli3.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3NpbWJvbGkzLmpwZyIsImlhdCI6MTcwMjU3NzQzMSwiZXhwIjoxNzM0MTEzNDMxfQ.62f75RCfrex2s8TJnPCEuI_g-yoUlMCXn_M1XIGyx6Q&t=2023-12-14T18%3A10%3A32.063Z',
    '{"10", "18", "-3", "11"}',
    '11',
    6
  ),
  (
    '3 raised to the 3 is equals to',
    'Math',
    'https://fjjbztpzvhrabesuopnj.supabase.co/storage/v1/object/sign/LambertQuiz/Math/potenza.gif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMYW1iZXJ0UXVpei9NYXRoL3BvdGVuemEuZ2lmIiwiaWF0IjoxNzAyNTA0NzkxLCJleHAiOjE3MzQwNDA3OTF9.b0QrIDSLFLqP6boYfGWnzukgDixznsEJZ82SsBkLR00&t=2023-12-13T21%3A59%3A53.286Z',
    '{"3", "1", "27", "0"}',
    '27',
    6
  );

SELECT
  *
from
  public.questions;

--- Progresses
CREATE TABLE IF NOT EXISTS
  public.progresses (
    progresses_id SERIAL NOT NULL PRIMARY KEY,
    _user INTEGER NOT NULL,
    quiz INTEGER NOT NULL,
    quiz_started_at TIMESTAMP NOT NULL,
    quiz_finished_at TIMESTAMP NOT NULL,
    quiz_score INTEGER NOT NULL,
    inserted_at TIMESTAMP WITH time zone DEFAULT TIMEZONE ('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
    updated_at TIMESTAMP WITH time zone DEFAULT TIMEZONE ('UTC'::text, NOW() + INTERVAL '+1 hours') NOT NULL,
    CONSTRAINT progresses__user_quiz_unique UNIQUE (_user, quiz, quiz_started_at),
    CONSTRAINT progresses_user_fk FOREIGN KEY (_user) REFERENCES public.users (user_id) ON DELETE CASCADE,
    CONSTRAINT progresses_quiz_fk FOREIGN KEY (quiz) REFERENCES public.quizzes (quiz_id) ON DELETE CASCADE
  );

COMMENT
  ON COLUMN public.progresses.progresses_id IS 'The integer incremental progresses ID.';

COMMENT
  ON COLUMN public.progresses._user IS 'The user quiz question foreign key.';

COMMENT
  ON COLUMN public.progresses.quiz IS 'The quiz question foreign key.';

COMMENT
  ON COLUMN public.progresses.quiz_started_at IS 'The quiz start timestamp.';

COMMENT
  ON COLUMN public.progresses.quiz_finished_at IS 'The quiz end timestamp.';

COMMENT
  ON COLUMN public.progresses.quiz_score IS 'The user quiz score point.';

COMMENT
  ON COLUMN public.progresses.inserted_at IS 'The TIMESTAMP date and time when the record was inserted.';

COMMENT
  ON COLUMN public.progresses.updated_at IS 'The TIMESTAMP date and time when the record was updated.';

COMMENT
  ON TABLE public.progresses IS 'LambertQuiz app table that rappresents the quizzes played by a specific user, used for statistics.';

ALTER TABLE
  public.progresses
ADD
  CONSTRAINT check_progresses_started_at_inserted_at_updated_at CHECK (
    public.progresses.quiz_started_at < progresses.inserted_at
    AND public.progresses.quiz_started_at < progresses.updated_at
    AND public.progresses.quiz_started_at < public.progresses.quiz_finished_at
  );

ALTER TABLE
  public.progresses
ADD
  CONSTRAINT check_progresses_finished_at_inserted_at_updated_at CHECK (
    public.progresses.quiz_finished_at <= progresses.inserted_at
    AND public.progresses.quiz_started_at < progresses.updated_at
    AND public.progresses.quiz_finished_at > public.progresses.quiz_started_at
  );

ALTER TABLE
  public.progresses
ADD
  CONSTRAINT check_progresses_inserted_at_updated_at CHECK (
    public.progresses.inserted_at <= progresses.updated_at
  );

ALTER TABLE
  public.progresses
ADD
  CONSTRAINT check_progresses_now CHECK (public.progresses.quiz_finished_at <= NOW());

ALTER TABLE
  public.progresses
ADD
  CONSTRAINT check_progresses_quiz_score CHECK (
    public.progresses.quiz_score >= 0
    AND public.progresses.quiz_score <= 5
  );

CREATE
OR REPLACE FUNCTION progresses_updated_at_set_timestamp () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW() + INTERVAL '+1 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_progresses_updated_at_set_timestamp BEFORE
UPDATE
  ON public.progresses FOR EACH ROW
EXECUTE
  FUNCTION progresses_updated_at_set_timestamp ();

CREATE
OR REPLACE FUNCTION progresses_quiz_finished_at_fix () RETURNS TRIGGER AS $$
BEGIN
  IF(NEW.quiz_finished_at > NOW()) THEN
    NEW.quiz_finished_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_progresses_quiz_finished_at_fix BEFORE
INSERT
  ON public.progresses FOR EACH ROW
EXECUTE
  FUNCTION progresses_quiz_finished_at_fix();

CREATE
OR REPLACE FUNCTION check_user_activity_sub () RETURNS TRIGGER AS $$
BEGIN
  IF ((SELECT public.users.inserted_at FROM public.users WHERE public.users.user_id = NEW._user) > NEW.quiz_finished_at) THEN
 	RAISE EXCEPTION 'A User cannot take a quiz before signing up for LambertQuiz!' ;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER trigger_check_user_activity_sub BEFORE INSERT ON public.progresses FOR EACH ROW
EXECUTE
  FUNCTION check_user_activity_sub ();

CREATE INDEX
  progresses_index ON public.progresses USING btree (progresses_id);

/*
INSERT INTO
public.progresses (
_user,
quiz,
quiz_started_at,
quiz_finished_at,
quiz_score
)
VALUES
(
1,
1,
'2024-01-02 10:23:54',
'2024-01-02 10:24:32',
2
),
(
1,
1,
'2024-01-07 11:23:54',
'2024-01-07 11:24:32',
2
),
(
1,
2,
'2024-01-06 09:23:54',
'2024-01-06 09:24:32',
2
),
(
1,
3,
'2024-01-05 11:33:54',
'2024-01-05 11:34:32',
2
);
 */
SELECT
  *
FROM
  progresses;

GRANT
  usage ON schema "public" TO postgres;

GRANT
SELECT
,
  INSERT,
UPDATE
,
  DELETE ON ALL TABLES IN SCHEMA "public" TO postgres;

GRANT
  USAGE,
SELECT
  ON ALL SEQUENCES IN SCHEMA public TO postgres;

GRANT
  usage ON schema "public" TO anon;

GRANT
SELECT
,
  INSERT,
UPDATE
,
  DELETE ON ALL TABLES IN SCHEMA "public" TO anon;

GRANT
  USAGE,
SELECT
  ON ALL SEQUENCES IN SCHEMA public TO anon;

GRANT
  usage ON schema "public" TO authenticated;

GRANT
SELECT
,
  INSERT,
UPDATE
,
  DELETE ON ALL TABLES IN SCHEMA "public" TO authenticated;

GRANT
  USAGE,
SELECT
  ON ALL SEQUENCES IN SCHEMA public TO authenticated;

/*

Other functions:

 */
 
CREATE
OR REPLACE FUNCTION delete_user (IN input_email TEXT) RETURNS VOID LANGUAGE SQL SECURITY DEFINER AS $$
  DELETE FROM auth.users
  WHERE auth.users.email = input_email;
$$;

CREATE
OR REPLACE FUNCTION get_best_five_users_stats () RETURNS TABLE (
  username VARCHAR,
  _averageScore NUMERIC,
  averageScore TEXT,
  worstScore TEXT,
  betterScore TEXT,
  totalQuizzes TEXT,
  quizzesCompletitionPercentage TEXT
) AS $$
DECLARE
    quizzes_number INTEGER;
    questions_number INTEGER;
BEGIN
  SELECT DISTINCT
    COUNT(DISTINCT quiz_id) 
      INTO quizzes_number 
  FROM public.Quizzes;
  SELECT 5 INTO questions_number;
RETURN QUERY
  SELECT 
    DISTINCT
  Users.username,
  ROUND(AVG(Progresses.quiz_score), 2) AS _averageScore, 
  ROUND(AVG(Progresses.quiz_score), 2)::VARCHAR || ' / ' || questions_number AS averageScore,
  MIN(Progresses.quiz_score)::VARCHAR || ' / ' || questions_number AS worstScore,
  MAX(Progresses.quiz_score)::VARCHAR || ' / ' || questions_number AS betterScore,
  COUNT(DISTINCT Quizzes.quiz_id)::VARCHAR || ' / ' || quizzes_number AS totalQuizzes,
  (ROUND(
    CAST(
      (
        CAST(COUNT(DISTINCT Quizzes.quiz_id) AS FLOAT) / (SELECT COUNT(DISTINCT q.quiz_id) FROM Quizzes q)
      ) AS NUMERIC
    ),
    2
  )* 100)::VARCHAR || '%' AS quizzesCompletitionPercentage
FROM
  Progresses
  JOIN Users ON Progresses._user = Users.user_id
  JOIN Quizzes ON Progresses.quiz = Quizzes.quiz_id
GROUP BY
  Users.username
ORDER BY
 _averageScore DESC,
 Users.username ASC
LIMIT
  5;
END;
$$ LANGUAGE PLPGSQL;

CREATE
OR REPLACE FUNCTION get_last_seven_days_quizzes (IN _user_id INTEGER) RETURNS TABLE (day TEXT, totalQuizzes BIGINT) AS $$
BEGIN
    RETURN QUERY
WITH RECURSIVE date_series AS (
  SELECT NOW()::TIMESTAMP WITHOUT TIME ZONE AS date
  UNION ALL
  SELECT date - INTERVAL '1 day'
  FROM date_series
  WHERE date_series.date > NOW() - INTERVAL '6 days'
)

SELECT TO_CHAR(date_series.date::DATE, 'DD/MM') AS day,
       COALESCE(COUNT(p.progresses_id), 0) AS quizzes_solved
FROM date_series
LEFT JOIN public.progresses p ON date_series.date::DATE = p.quiz_started_at::DATE AND p._user = _user_id
GROUP BY date_series.date::DATE
ORDER BY date_series.date::DATE ASC;
END;
$$ LANGUAGE PLPGSQL;

CREATE
OR REPLACE FUNCTION get_user_pref_category (IN _user_id INTEGER) RETURNS TABLE (category categories, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
  Quizzes.category,
  COUNT(Quizzes.quiz_id) AS count
FROM
  Progresses
  JOIN Users ON Progresses._user = Users.user_id
  JOIN Quizzes ON Progresses.quiz = Quizzes.quiz_id 
WHERE
  Users.user_id = _user_id
GROUP BY
  Quizzes.category
ORDER BY
 count DESC
LIMIT 1;
END;
$$ LANGUAGE PLPGSQL;

SELECT
  *
FROM
  pg_catalog.pg_tables
WHERE
  schemaname = 'public';

CREATE
OR REPLACE FUNCTION get_progress (
  IN user_id INTEGER,
  IN quiz_id INTEGER,
  IN _quiz_started_at TIMESTAMP
) RETURNS SETOF Progresses LANGUAGE SQL AS $$
  SELECT DISTINCT
 *
FROM
  Progresses
WHERE
  Progresses._user = user_id AND
  Progresses.quiz = quiz_id AND
  Progresses.quiz_started_at = _quiz_started_at;
$$;

CREATE
OR REPLACE FUNCTION store_progress (
  IN user_id INTEGER,
  IN quiz_id INTEGER,
  IN _quiz_started_at TIMESTAMP,
  IN _quiz_finished_at TIMESTAMP,
  IN _quiz_score INTEGER
) RETURNS VOID LANGUAGE SQL AS $$
  INSERT
  INTO Progresses (
    _user,
    quiz,
    quiz_started_at,
    quiz_finished_at,
    quiz_score
  )
  VALUES (
    user_id,
    quiz_id,
    _quiz_started_at,
    _quiz_finished_at,
    _quiz_score
  )
$$;

CREATE
OR REPLACE FUNCTION get_searched_quizzes (IN quiz_category TEXT) RETURNS SETOF Quizzes LANGUAGE SQL AS $$
SELECT 
  DISTINCT
    *
FROM
  Quizzes
WHERE
  category::TEXT ILIKE TRIM(quiz_category) || '%' ;
$$;

CREATE
OR REPLACE FUNCTION get_quizzes_days (IN _user_id INTEGER) RETURNS TABLE (quiz_day TEXT) AS $$ 
BEGIN
  RETURN QUERY
SELECT
  DISTINCT
    TO_CHAR(p.quiz_finished_at, 'YYYY-MM-DD') AS quiz_day
FROM
  Progresses p
    JOIN Quizzes q ON p.quiz = q.quiz_id
    JOIN Users u ON p._user = u.user_id
WHERE
  u.user_id = _user_id;
END;
$$ LANGUAGE PLPGSQL;

;

-- Example query:

select * from get_best_five_users_stats();
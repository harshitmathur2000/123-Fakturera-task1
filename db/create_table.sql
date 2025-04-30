SET client_encoding = 'UTF8';

CREATE TABLE page_texts (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(255) UNIQUE NOT NULL,
    english_text TEXT NOT NULL ,
    swedish_text TEXT NOT NULL 
);



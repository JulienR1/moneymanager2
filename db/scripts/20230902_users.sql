CREATE TABLE users
(
  firstname VARCHAR(64) NOT NULL,
  id SERIAL NOT NULL,
  email VARCHAR(256) NOT NULL,
  lastname VARCHAR(64) NOT NULL,
  password VARCHAR(256) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE pictures
(
  id SERIAL NOT NULL,
  url VARCHAR(512) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE user_to_profile_picture
(
  picture_id SERIAL NOT NULL,
  user_id SERIAL NOT NULL,
  PRIMARY KEY (picture_id, user_id),
  FOREIGN KEY (picture_id) REFERENCES pictures(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
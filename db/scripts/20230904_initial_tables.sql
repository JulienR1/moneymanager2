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

CREATE TABLE profile_picture
(
  picture_id SERIAL NOT NULL,
  user_id SERIAL NOT NULL,
  PRIMARY KEY (picture_id, user_id),
  FOREIGN KEY (picture_id) REFERENCES pictures(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE icons
(
  id SERIAL NOT NULL,
  label VARCHAR(64) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE teams
(
  id SERIAL NOT NULL,
  label VARCHAR(64) NOT NULL,
  creation_date TIMESTAMP NOT NULL,
  creator_id SERIAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE dashboards
(
  id SERIAL NOT NULL,
  creation_date TIMESTAMP NOT NULL,
  label VARCHAR(64) NOT NULL,
  creator_id SERIAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE team_to_dashboard
(
  dashboard_id SERIAL NOT NULL,
  team_id SERIAL NOT NULL,
  PRIMARY KEY (dashboard_id, team_id),
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE user_to_dashboard
(
  dashboard_id SERIAL NOT NULL,
  user_id SERIAL NOT NULL,
  PRIMARY KEY (dashboard_id, user_id),
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE categories
(
  color CHAR(6) NOT NULL,
  label VARCHAR(128) NOT NULL,
  id SERIAL NOT NULL,
  icon_id SERIAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (icon_id) REFERENCES icons(id)
);

CREATE TABLE transactions
(
  id SERIAL NOT NULL,
  label VARCHAR(128) NOT NULL,
  amount FLOAT NOT NULL,
  date TIMESTAMP NOT NULL,
  receipt_id SERIAL NOT NULL,
  user_id SERIAL NOT NULL,
  category_id SERIAL NOT NULL,
  dashboard_id SERIAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (receipt_id) REFERENCES pictures(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id)
);

CREATE TABLE user_to_team
(
  join_date TIMESTAMP NOT NULL,
  team_id SERIAL NOT NULL,
  user_id SERIAL NOT NULL,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE dashboard_categories
(
  category_id SERIAL NOT NULL,
  dashboard_id SERIAL NOT NULL,
  PRIMARY KEY (category_id, dashboard_id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (dashboard_id) REFERENCES dashboards(id)
);

CREATE TABLE refunds
(
  id SERIAL NOT NULL,
  acknowledgement_date TIMESTAMP NOT NULL,
  receiving_user_id SERIAL NOT NULL,
  transaction_id SERIAL NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (receiving_user_id) REFERENCES users(id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);
CREATE OR REPLACE VIEW profiles AS
SELECT users.id, email, firstname, lastname, password, url
FROM users
LEFT JOIN profile_picture pp ON pp.user_id = users.id
LEFT JOIN pictures pic ON pic.id = pp.picture_id;

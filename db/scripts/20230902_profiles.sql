CREATE VIEW profiles AS
SELECT users.id, email, firstname, lastname, password, url
FROM users
LEFT JOIN user_to_profile_picture utp ON utp.user_id = users.id
LEFT JOIN pictures pic ON pic.id = utp.picture_id;

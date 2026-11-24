INSERT INTO users (id, username, email, password_hash) 
VALUES 
("1", "test1", "test@test.com", "b'$2b$12$GZyW.esFUtO5biH4nk1kROMoPjHViFS6K7w.P6jaN8hw0M1UOvqRG'"),
("2", "test2", "more_test@test.com", "b'$2b$12$yo/XFcWBbanp6tmte6yUI.9IQ3ya6RgkWG8tx0u.terLL1qiv2U1e'");

INSERT INTO tasks (id, user_id, title, description, due_date, status, priority)
VALUES
("1", "1", "test_title", "test_description", "2027-01-01 00:00:00", "to do", "urgent"),
("2", "2", "another_title", "another_description", "2029-01-01 00:00:00", "completed", "low");

INSERT INTO tags (id, task_tag_id, tag)
VALUES 
("1", "1", "my_tag"),
("2", "1", "another_tag"),
("3", "2", "mega_tag"),
("4", "2", "super_tag")

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE CHECK(length(username)<=100),
    email TEXT NOT NULL CHECK (email LIKE ("%@%")) UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL CHECK (LENGTH(title) <=100),
    description TEXT NOT NULL CHECK (LENGTH(description) <=500),
    due_date TEXT NOT NULL,
    status NOT NULL CHECK (status IN ("to do", "in progress", "completed")) DEFAULT "to do",
    priority NOT NULL CHECK (priority IN ("low", "medium", "urgent")),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_tag_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    UNIQUE (task_tag_id, tag),
    FOREIGN KEY (task_tag_id) REFERENCES tasks (id) ON DELETE CASCADE
);
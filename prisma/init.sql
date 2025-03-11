-- Connect to the database
\c mydatabase;

CREATE TABLE IF NOT EXISTS "users" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    points INTEGER DEFAULT 0,
    badges TEXT[],
    achievements TEXT[]
);

CREATE TABLE IF NOT EXISTS "points" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    points INTEGER NOT NULL,
    reason VARCHAR(255),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "quizzes" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    userId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "questions" (
    id SERIAL PRIMARY KEY,
    quizId INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT[],
    answer INTEGER NOT NULL,
    FOREIGN KEY (quizId) REFERENCES "quizzes"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "attempts" (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    quizId INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE,
    FOREIGN KEY (quizId) REFERENCES "quizzes"(id) ON DELETE CASCADE
);

-- -- Create User table
-- CREATE TABLE IF NOT EXISTS "users" (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR(255) UNIQUE NOT NULL,
--     avatar TEXT,
--     rank VARCHAR(255),
--     points INTEGER DEFAULT 0,
--     badges TEXT[],
--     achievements TEXT[]
-- );

-- -- Create Course table
-- CREATE TABLE IF NOT EXISTS "courses" (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     progress INTEGER DEFAULT 0,
--     status VARCHAR(255),
--     userId INTEGER NOT NULL,
--     FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
-- );

-- -- Create Quiz table
-- CREATE TABLE IF NOT EXISTS "quizzes" (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     score INTEGER NOT NULL,
--     attempts INTEGER DEFAULT 0,
--     userId INTEGER NOT NULL,
--     FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
-- );

-- -- Create Stats table
-- CREATE TABLE IF NOT EXISTS "stats" (
--     id SERIAL PRIMARY KEY,
--     userId INTEGER UNIQUE NOT NULL,
--     quizzesAttempted INTEGER DEFAULT 0,
--     bestScore INTEGER DEFAULT 0,
--     coursesCompleted INTEGER DEFAULT 0,
--     streak INTEGER DEFAULT 0,
--     FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
-- );

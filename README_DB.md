Neon / PostgreSQL setup (development)

This project supports storing users and issues in a PostgreSQL database (e.g. Neon). If you set the environment variable `DATABASE_URL` to a valid Postgres connection string, the app will use the DB instead of the in-memory fallback.

Recommended tables (run these in psql or in Neon SQL editor):

```sql
-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

-- issues table
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  status TEXT NOT NULL,
  location TEXT,
  imageUrl TEXT,
  imageHint TEXT,
  userId TEXT,
  userName TEXT,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updates JSONB DEFAULT '[]'::jsonb
);
```

Environment variables:
- `DATABASE_URL` - Postgres connection string (Neon provides this). Example: `postgresql://user:pass@host:5432/defaultdb?sslmode=require`
- `SESSION_SECRET` - a random secret for signing session JWTs.

Notes & next steps:
- Passwords are currently stored as plain text to keep the example small. For production, hash passwords (bcrypt or argon2) before storing.
- You may want to run the SQL above once in your Neon dashboard or via psql to prepare the database.
- After creating the DB and setting `DATABASE_URL`, restart the Next dev server.

Testing DB connectivity:
- With `DATABASE_URL` set, open the app and create a signup or report an issue. Check the `users` and `issues` tables in Neon to confirm rows are created.

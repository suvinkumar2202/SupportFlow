-- SupportFlow Seed Data (SQLite)
-- Run AFTER schema.sql (or rely on backend/src/main/resources/data.sql which
-- is auto-loaded by Spring Boot on startup).
-- Passwords below are BCrypt hashes of "password123".

-- Sample users covering all roles (INSERT OR IGNORE makes this idempotent).
INSERT OR IGNORE INTO users (name, email, password, role) VALUES
  ('Alice Customer',  'alice@example.com',     '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer'),
  ('Suvin Kumar',     'suvin123@gmail.com',    '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer'),
  ('Support Agent',   'agent@supportflow.com', '$2b$10$5VSaTeKAKiWuaDj6AHdgJ.vvEUR6.KRAHjLBfm4f0gs/0XCusyPdS', 'agent'),
  ('Admin User',      'admin@supportflow.com', '$2b$10$.gpXbpeHwvJ5cWju5vmNfegb2HS2.HIZmgXizGsU5dDeOvA2gwOgq', 'admin');

-- Sample open support ticket for the sample customer (idempotent: only inserted if absent).
INSERT INTO tickets (customer_id, title, description, priority, status)
SELECT id,
       'Cannot reset password',
       'I am unable to reset my password through the self-service portal and need assistance.',
       'high', 'open'
FROM users
WHERE email = 'alice@example.com'
  AND NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Cannot reset password');

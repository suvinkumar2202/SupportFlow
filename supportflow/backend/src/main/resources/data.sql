-- ---------------------------------------------------------------------------
-- SupportFlow seed data (MySQL 5.6+)
--
-- Runs automatically on startup after Hibernate creates/updates the tables
-- (ddl-auto=update + spring.sql.init.mode=always).
-- Every insert is idempotent, so restarting the backend will not duplicate rows.
--
-- Passwords below are BCrypt hashes of "password123".
-- role values match the RoleConverter: customer / agent / admin.
-- priority / status use enum names (uppercase) to match @Enumerated(STRING).
-- created_at / updated_at are supplied explicitly (no DB-side default).
-- ---------------------------------------------------------------------------

INSERT IGNORE INTO users (name, email, password, role, created_at) VALUES
  ('Alice Customer',  'alice@example.com',     '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer', NOW()),
  ('Suvin Kumar',     'suvin123@gmail.com',    '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer', NOW()),
  ('Support Agent',   'agent@supportflow.com', '$2b$10$5VSaTeKAKiWuaDj6AHdgJ.vvEUR6.KRAHjLBfm4f0gs/0XCusyPdS', 'agent',    NOW()),
  ('Admin User',      'admin@supportflow.com', '$2b$10$.gpXbpeHwvJ5cWju5vmNfegb2HS2.HIZmgXizGsU5dDeOvA2gwOgq', 'admin',    NOW());

-- Sample tickets.
-- NOTE: MySQL requires FROM DUAL for a SELECT with a WHERE clause but no table.
INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com' LIMIT 1),
  'Cannot reset password',
  'I am unable to reset my password through the self-service portal and need assistance.',
  'HIGH', 'OPEN',
  (SELECT id FROM users WHERE email = 'agent@supportflow.com' LIMIT 1),
  NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Cannot reset password');

INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com' LIMIT 1),
  'Billing discrepancy on invoice #1234',
  'The invoice shows a charge that does not match my order. Please investigate.',
  'MEDIUM', 'OPEN',
  (SELECT id FROM users WHERE email = 'agent@supportflow.com' LIMIT 1),
  NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Billing discrepancy on invoice #1234');

INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE email = 'suvin123@gmail.com' LIMIT 1),
  'Feature request: dark mode',
  'It would be great to have a dark mode option for the dashboard.',
  'LOW', 'OPEN',
  NULL,
  NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Feature request: dark mode');

-- Sample feedback.
INSERT INTO feedback (user_id, ticket_id, subject, description, category, rating, status, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com' LIMIT 1),
  (SELECT id FROM tickets WHERE title = 'Cannot reset password' LIMIT 1),
  'Password reset ticket',
  'The agent helped me reset my password quickly. Great support!',
  'positive', 5, 'NEW',
  NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM feedback WHERE subject = 'Password reset ticket');

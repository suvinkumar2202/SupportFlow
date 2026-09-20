-- SupportFlow SQLite seed data (idempotent).
-- Runs automatically after Hibernate creates the tables (ddl-auto=update).
-- Passwords below are BCrypt hashes of "password123".

INSERT OR IGNORE INTO users (name, email, password, role) VALUES
  ('Alice Customer',  'alice@example.com',     '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer'),
  ('Suvin Kumar',     'suvin123@gmail.com',    '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer'),
  ('Support Agent',   'agent@supportflow.com', '$2b$10$5VSaTeKAKiWuaDj6AHdgJ.vvEUR6.KRAHjLBfm4f0gs/0XCusyPdS', 'agent'),
  ('Admin User',      'admin@supportflow.com', '$2b$10$.gpXbpeHwvJ5cWju5vmNfegb2HS2.HIZmgXizGsU5dDeOvA2gwOgq', 'admin');

-- Sample tickets (idempotent: only inserted if the title doesn't already exist).
INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  'Cannot reset password',
  'I am unable to reset my password through the self-service portal and need assistance.',
   'HIGH', 'OPEN',
   (SELECT id FROM users WHERE email = 'agent@supportflow.com')
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Cannot reset password');

INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  'Billing discrepancy on invoice #1234',
  'The invoice shows a charge that does not match my order. Please investigate.',
  'MEDIUM', 'OPEN',
  (SELECT id FROM users WHERE email = 'agent@supportflow.com')
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Billing discrepancy on invoice #1234');

INSERT INTO tickets (customer_id, title, description, priority, status, assigned_to)
SELECT
  (SELECT id FROM users WHERE email = 'suvin123@gmail.com'),
  'Feature request: dark mode',
  'It would be great to have a dark mode option for the dashboard.',
  'LOW', 'OPEN',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Feature request: dark mode');

-- Sample feedback (idempotent).
INSERT INTO feedback (user_id, ticket_id, subject, description, category, rating, status)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  (SELECT id FROM tickets WHERE title = 'Cannot reset password'),
  'Password reset ticket',
  'The agent helped me reset my password quickly. Great support!',
  'positive', 5, 'NEW'
WHERE NOT EXISTS (SELECT 1 FROM feedback WHERE subject = 'Password reset ticket');

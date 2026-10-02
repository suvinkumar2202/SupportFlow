-- ---------------------------------------------------------------------------
-- SupportFlow Seed Data (MySQL 5.6+)
--
-- Run AFTER schema.sql. Every insert is idempotent, so re-running this is safe:
--   * users     -> INSERT IGNORE relies on the UNIQUE key on email
--   * tickets   -> guarded with WHERE NOT EXISTS (no unique key on title)
--   * feedback  -> guarded with WHERE NOT EXISTS
--
-- Passwords below are BCrypt hashes of "password123".
-- Note: created_at / updated_at have no DB-side default, so they are supplied
-- explicitly here.
-- ---------------------------------------------------------------------------

-- Sample users covering all roles. role values match the RoleConverter
-- (customer / agent / admin).
INSERT IGNORE INTO users (name, email, password, role, created_at) VALUES
  ('Alice Customer',  'alice@example.com',     '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer', NOW()),
  ('Suvin Kumar',     'suvin123@gmail.com',    '$2b$10$LqobGGTWjla0UvsnpYKfUOM8Aq3A2LmfsptXR0KOYmgrhJTZ7H.vK', 'customer', NOW()),
  ('Support Agent',   'agent@supportflow.com', '$2b$10$5VSaTeKAKiWuaDj6AHdgJ.vvEUR6.KRAHjLBfm4f0gs/0XCusyPdS', 'agent',    NOW()),
  ('Admin User',      'admin@supportflow.com', '$2b$10$.gpXbpeHwvJ5cWju5vmNfegb2HS2.HIZmgXizGsU5dDeOvA2gwOgq', 'admin',    NOW());

-- Sample open support ticket for the sample customer.
-- priority / status use the enum names (uppercase) because the entities use
-- @Enumerated(EnumType.STRING).
-- NOTE: MySQL requires FROM DUAL for a SELECT with a WHERE clause but no table.
INSERT INTO tickets (customer_id, title, description, priority, status, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE email = 'alice@example.com' LIMIT 1),
  'Cannot reset password',
  'I am unable to reset my password through the self-service portal and need assistance.',
  'HIGH', 'OPEN',
  NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Cannot reset password');

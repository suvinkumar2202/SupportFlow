-- SupportFlow Database Schema (SQLite)
-- Core authentication + ticketing tables: USERS, TICKETS, FEEDBACK.
-- Idempotent via CREATE TABLE IF NOT EXISTS.
-- For the running app the tables are auto-created by Hibernate (ddl-auto=update);
-- this file is the canonical schema for reference / manual setup.

-- USERS: authentication foundation.
-- role is stored as TEXT because the application maps the Role enum
-- through a JPA AttributeConverter (customer/agent/admin strings).
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
  name        TEXT         NOT NULL,
  email       TEXT         NOT NULL UNIQUE,
  password    TEXT         NOT NULL, -- BCrypt hashed password - NEVER store plain text
  role        TEXT         NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TICKETS: support tickets raised by customers.
CREATE TABLE IF NOT EXISTS tickets (
  id           INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
  customer_id  INTEGER      NOT NULL,
  title        TEXT         NOT NULL,
  description  TEXT         NOT NULL,
  priority     TEXT         NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status       TEXT         NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  assigned_to  INTEGER      NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at  TIMESTAMP    NULL,
  FOREIGN KEY (customer_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets (customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets (assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status   ON tickets (status);

-- FEEDBACK: customer feedback, optionally linked to a ticket.
CREATE TABLE IF NOT EXISTS feedback (
  id          INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER      NOT NULL,
  ticket_id   INTEGER      NULL,
  subject     TEXT         NOT NULL,
  description TEXT         NOT NULL,
  category    TEXT         NULL,
  rating      INTEGER      NULL,
  status      TEXT         NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','archived')),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users   (id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_feedback_user   ON feedback (user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_ticket ON feedback (ticket_id);

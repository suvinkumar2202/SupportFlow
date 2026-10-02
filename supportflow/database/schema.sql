-- ---------------------------------------------------------------------------
-- SupportFlow Database Schema (MySQL 5.6+)
--
-- NON-DESTRUCTIVE: every statement is guarded with IF NOT EXISTS, so running
-- this against an existing supportflow_db will never drop or truncate data.
--
-- Notes on MySQL 5.6 compatibility:
--   * AUTOINCREMENT (SQLite)  -> AUTO_INCREMENT (MySQL)
--   * TEXT stays TEXT for long free-form fields; fixed-width values use VARCHAR
--   * created_at / updated_at use DATETIME rather than TIMESTAMP. DATETIME
--     avoids implicit timezone conversion and sidesteps the older MySQL rule
--     limiting how many columns may carry a CURRENT_TIMESTAMP default.
--   * Indexes are declared inline because MySQL does not support
--     CREATE INDEX IF NOT EXISTS.
-- ---------------------------------------------------------------------------

-- USERS: authentication foundation.
-- role is stored as TEXT/VARCHAR because the application maps the Role enum
-- through a JPA AttributeConverter (customer/agent/admin strings).
CREATE TABLE IF NOT EXISTS users (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  password    VARCHAR(255) NOT NULL, -- BCrypt hashed password - NEVER store plain text
  role        VARCHAR(20)  NOT NULL DEFAULT 'customer',
  created_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- TICKETS: support tickets raised by customers.
CREATE TABLE IF NOT EXISTS tickets (
  id           BIGINT       NOT NULL AUTO_INCREMENT,
  customer_id  BIGINT       NOT NULL,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  priority     VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
  status       VARCHAR(20)  NOT NULL DEFAULT 'OPEN',
  assigned_to  BIGINT       NULL,
  created_at   DATETIME     NOT NULL,
  updated_at   DATETIME     NULL,
  resolved_at  DATETIME     NULL,
  PRIMARY KEY (id),
  KEY idx_tickets_customer (customer_id),
  KEY idx_tickets_assignee (assigned_to),
  KEY idx_tickets_status   (status),
  CONSTRAINT fk_tickets_customer FOREIGN KEY (customer_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_tickets_assignee FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- FEEDBACK: customer feedback, optionally linked to a ticket.
CREATE TABLE IF NOT EXISTS feedback (
  id          BIGINT       NOT NULL AUTO_INCREMENT,
  user_id     BIGINT       NOT NULL,
  ticket_id   BIGINT       NULL,
  subject     VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  category    VARCHAR(100) NULL,
  rating      INT          NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'NEW',
  created_at  DATETIME     NOT NULL,
  updated_at  DATETIME     NULL,
  PRIMARY KEY (id),
  KEY idx_feedback_user   (user_id),
  KEY idx_feedback_ticket (ticket_id),
  CONSTRAINT fk_feedback_user   FOREIGN KEY (user_id)   REFERENCES users   (id) ON DELETE CASCADE,
  CONSTRAINT fk_feedback_ticket FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

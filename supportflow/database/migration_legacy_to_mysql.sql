-- ---------------------------------------------------------------------------
-- SupportFlow: legacy schema -> entity model alignment (MySQL 5.6+)
--
-- NON-DESTRUCTIVE: no table is dropped and no existing row is deleted.
-- Only column definitions are widened / made nullable, and enum values are
-- upper-cased to match the @Enumerated(EnumType.STRING) entities.
--
-- Run this ONCE against an existing supportflow_db that was created by an
-- older version of the schema. New installations created by database/schema.sql
-- do not need it.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- tickets: ENUM columns (lowercase) -> VARCHAR, matching the entity which
-- stores enum NAMES such as 'HIGH', 'OPEN', 'IN_PROGRESS'.
-- Existing rows are preserved; their values are up-cased in place.
-- ---------------------------------------------------------------------------
ALTER TABLE tickets MODIFY priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE tickets MODIFY status   VARCHAR(20) NOT NULL DEFAULT 'OPEN';

UPDATE tickets SET priority = UPPER(priority);
UPDATE tickets SET status   = UPPER(status);

-- ---------------------------------------------------------------------------
-- feedback: the legacy table carried extra columns that the current Feedback
-- entity does not map (customer_id NOT NULL, an enum status).
--   * status  -> VARCHAR so the entity can store enum names ('NEW', ...)
--   * customer_id -> made NULLABLE so inserts that omit it succeed.
-- The column is kept (not dropped) so nothing is lost.
-- ---------------------------------------------------------------------------
ALTER TABLE feedback MODIFY status      VARCHAR(20) NOT NULL DEFAULT 'NEW';
ALTER TABLE feedback MODIFY customer_id BIGINT NULL;

UPDATE feedback SET status = UPPER(status);
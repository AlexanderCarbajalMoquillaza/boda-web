CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE guest_group
ADD COLUMN access_token UUID;

UPDATE guest_group
SET access_token = gen_random_uuid()
WHERE access_token IS NULL;

ALTER TABLE guest_group
ALTER COLUMN access_token SET NOT NULL;

ALTER TABLE guest_group
ADD CONSTRAINT uq_guest_group_access_token UNIQUE (access_token);

CREATE INDEX idx_guest_group_access_token ON guest_group(access_token);

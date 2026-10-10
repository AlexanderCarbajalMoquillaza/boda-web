ALTER TABLE wedding_photo
    ADD COLUMN section VARCHAR(30) NOT NULL DEFAULT 'GALLERY',
    ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE wedding_photo
    ADD CONSTRAINT chk_wedding_photo_section
    CHECK (section IN ('HERO', 'STORY', 'GALLERY', 'FOOTER'));

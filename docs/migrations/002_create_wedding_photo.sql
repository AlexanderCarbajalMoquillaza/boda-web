CREATE TABLE wedding_photo (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(180),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wedding_photo_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_wedding_photo_display_order
        CHECK (display_order >= 0)
);

CREATE INDEX idx_wedding_photo_wedding_order
    ON wedding_photo(wedding_id, display_order);

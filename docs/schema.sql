CREATE TABLE app_user (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'COUPLE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_app_user_role CHECK (role IN ('ADMIN', 'COUPLE'))
);

CREATE TABLE wedding (
    id BIGSERIAL PRIMARY KEY,
    owner_user_id BIGINT NOT NULL,
    title VARCHAR(160) NOT NULL,
    partner_one_name VARCHAR(100) NOT NULL,
    partner_two_name VARCHAR(100) NOT NULL,
    wedding_date DATE NOT NULL,
    venue_name VARCHAR(160),
    venue_address VARCHAR(255),
    invitation_slug VARCHAR(120) NOT NULL UNIQUE,
    max_registered_guests INTEGER NOT NULL DEFAULT 0,
    is_invitation_public BOOLEAN NOT NULL DEFAULT TRUE,
    welcome_message TEXT,
    story_text TEXT,
    dress_code VARCHAR(255),
    map_url VARCHAR(500),
    gift_registry_url VARCHAR(500),
    schedule_json TEXT NOT NULL DEFAULT '[]',
    faq_json TEXT NOT NULL DEFAULT '[]',
    tables_json TEXT NOT NULL DEFAULT '[]',
    show_welcome BOOLEAN NOT NULL DEFAULT TRUE,
    show_story BOOLEAN NOT NULL DEFAULT TRUE,
    show_schedule BOOLEAN NOT NULL DEFAULT TRUE,
    show_dress_code BOOLEAN NOT NULL DEFAULT TRUE,
    show_location BOOLEAN NOT NULL DEFAULT TRUE,
    show_gift_registry BOOLEAN NOT NULL DEFAULT TRUE,
    show_faq BOOLEAN NOT NULL DEFAULT TRUE,
    show_tables BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wedding_owner_user
        FOREIGN KEY (owner_user_id)
        REFERENCES app_user(id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_wedding_max_registered_guests
        CHECK (max_registered_guests >= 0)
);

CREATE TABLE guest_group (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    contact_name VARCHAR(120) NOT NULL,
    contact_email VARCHAR(160),
    contact_phone VARCHAR(40),
    access_token UUID NOT NULL UNIQUE,
    max_guests_allowed INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guest_group_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_guest_group_max_guests_allowed
        CHECK (max_guests_allowed > 0),
    CONSTRAINT chk_guest_group_status
        CHECK (status IN ('PENDING', 'CONFIRMED', 'DECLINED'))
);

CREATE TABLE reception_table (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    table_name VARCHAR(60) NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reception_table_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_table_name_per_wedding
        UNIQUE (wedding_id, table_name),
    CONSTRAINT chk_reception_table_capacity
        CHECK (capacity > 0)
);

CREATE TABLE guest (
    id BIGSERIAL PRIMARY KEY,
    guest_group_id BIGINT NOT NULL,
    reception_table_id BIGINT,
    full_name VARCHAR(120) NOT NULL,
    age_group VARCHAR(30) NOT NULL DEFAULT 'ADULT',
    menu_option VARCHAR(60),
    allergies TEXT,
    attendance_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guest_guest_group
        FOREIGN KEY (guest_group_id)
        REFERENCES guest_group(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_guest_reception_table
        FOREIGN KEY (reception_table_id)
        REFERENCES reception_table(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_guest_age_group
        CHECK (age_group IN ('ADULT', 'CHILD', 'BABY')),
    CONSTRAINT chk_guest_attendance_status
        CHECK (attendance_status IN ('PENDING', 'CONFIRMED', 'DECLINED'))
);

CREATE TABLE wedding_task (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wedding_task_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_wedding_task_priority
        CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT chk_wedding_task_status
        CHECK (status IN ('PENDING', 'IN_PROGRESS', 'DONE'))
);

CREATE TABLE vendor (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    name VARCHAR(160) NOT NULL,
    category VARCHAR(60) NOT NULL,
    contact_name VARCHAR(120),
    phone VARCHAR(40),
    email VARCHAR(160),
    estimated_cost NUMERIC(12,2),
    contracted BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vendor_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_vendor_estimated_cost
        CHECK (estimated_cost IS NULL OR estimated_cost >= 0)
);

CREATE TABLE budget_item (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    category VARCHAR(60) NOT NULL,
    concept VARCHAR(160) NOT NULL,
    estimated_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    vendor_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budget_item_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_budget_item_vendor
        FOREIGN KEY (vendor_id)
        REFERENCES vendor(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_budget_item_estimated_amount
        CHECK (estimated_amount >= 0),
    CONSTRAINT chk_budget_item_actual_amount
        CHECK (actual_amount >= 0),
    CONSTRAINT chk_budget_item_payment_status
        CHECK (payment_status IN ('PENDING', 'PARTIAL', 'PAID'))
);

CREATE TABLE schedule_item (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    starts_at TIME NOT NULL,
    title VARCHAR(160) NOT NULL,
    responsible VARCHAR(120),
    notes TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_item_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_schedule_item_display_order
        CHECK (display_order >= 0)
);

CREATE TABLE wedding_photo (
    id BIGSERIAL PRIMARY KEY,
    wedding_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(180),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    section VARCHAR(30) NOT NULL DEFAULT 'GALLERY',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wedding_photo_wedding
        FOREIGN KEY (wedding_id)
        REFERENCES wedding(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_wedding_photo_display_order
        CHECK (display_order >= 0),
    CONSTRAINT chk_wedding_photo_section
        CHECK (section IN ('HERO', 'STORY', 'GALLERY', 'FOOTER'))
);

CREATE INDEX idx_wedding_owner ON wedding(owner_user_id);
CREATE INDEX idx_guest_group_wedding ON guest_group(wedding_id);
CREATE INDEX idx_guest_group_status ON guest_group(status);
CREATE INDEX idx_guest_group_access_token ON guest_group(access_token);
CREATE INDEX idx_guest_group_guest_group ON guest(guest_group_id);
CREATE INDEX idx_task_wedding ON wedding_task(wedding_id);
CREATE INDEX idx_vendor_wedding ON vendor(wedding_id);
CREATE INDEX idx_budget_wedding ON budget_item(wedding_id);
CREATE INDEX idx_table_wedding ON reception_table(wedding_id);
CREATE INDEX idx_schedule_wedding ON schedule_item(wedding_id);
CREATE INDEX idx_wedding_photo_wedding_order ON wedding_photo(wedding_id, display_order);

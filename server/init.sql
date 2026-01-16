-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Roles
-- Drops existing type if exists to allow clean re-run during dev
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM (
    'Mecánico especialista', 
    'Líder Mecánico', 
    'Ingeniero de Calidad', 
    'Jefe de Calidad', 
    'Jefe de servicio', 
    'Jefe SGI', 
    'Asesor HSE', 
    'Soldador', 
    'Op Maquina herramienta', 
    'Gerente Servicio', 
    'Gerente Operaciones', 
    'Encargado de Bodega'
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Service Orders (Context)
CREATE TYPE order_status AS ENUM ('open', 'closed');

CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., "SO-12345"
    description TEXT,
    status order_status DEFAULT 'open',
    sharepoint_folder_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Form Templates
CREATE TABLE IF NOT EXISTS form_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'R3', 'R7'
    name VARCHAR(255) NOT NULL,
    schema_definition JSONB NOT NULL, -- The structure/questions of the form
    version INTEGER DEFAULT 1
);

-- 4. Form Submissions
CREATE TYPE submission_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES form_templates(id),
    service_order_id UUID REFERENCES service_orders(id),
    technician_id UUID REFERENCES users(id),
    supervisor_id UUID REFERENCES users(id), -- Nullable, assigned reviewer
    status submission_status DEFAULT 'draft',
    form_data JSONB NOT NULL DEFAULT '{}',
    sharepoint_file_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Workflow & Signatures
CREATE TABLE IF NOT EXISTS form_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    step_name VARCHAR(100) NOT NULL, -- e.g., 'technician_sign_off'
    signature_data TEXT, -- Base64 or URL
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

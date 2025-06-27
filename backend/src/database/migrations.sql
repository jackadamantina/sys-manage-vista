
-- Create database schema for IDM Experience

-- Users table
CREATE TABLE IF NOT EXISTS user_idm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Systems table
CREATE TABLE IF NOT EXISTS systems_idm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  hosting VARCHAR(100),
  access_type VARCHAR(100),
  responsible VARCHAR(255),
  user_management_responsible VARCHAR(255),
  password_complexity VARCHAR(255),
  onboarding_type VARCHAR(100),
  offboarding_type VARCHAR(100),
  offboarding_priority VARCHAR(100),
  named_users BOOLEAN,
  sso_configuration VARCHAR(255),
  integration_type VARCHAR(100),
  region_blocking VARCHAR(255),
  mfa_configuration VARCHAR(255),
  mfa_policy VARCHAR(255),
  mfa_sms_policy VARCHAR(255),
  logs_status VARCHAR(100),
  log_types JSONB,
  version VARCHAR(50),
  integrated_users BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES user_idm(id)
);

-- Imported users table
CREATE TABLE IF NOT EXISTS imported_users_idm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  username VARCHAR(100),
  department VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- System users table
CREATE TABLE IF NOT EXISTS system_users_idm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id UUID NOT NULL REFERENCES systems_idm(id) ON DELETE CASCADE,
  name VARCHAR(255),
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Organization settings table
CREATE TABLE IF NOT EXISTS organization_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name VARCHAR(255) NOT NULL DEFAULT 'Empresa LTDA',
  timezone VARCHAR(100) NOT NULL DEFAULT 'America/Sao_Paulo',
  password_policy JSONB DEFAULT '{"min_length": 8, "expiry_days": 90, "require_numbers": true, "require_lowercase": true, "require_uppercase": true, "require_special_chars": true}',
  session_timeout_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User MFA settings table
CREATE TABLE IF NOT EXISTS user_mfa_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_idm(id) ON DELETE CASCADE,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  mfa_type VARCHAR(50) DEFAULT 'totp',
  phone_number VARCHAR(20),
  secret_key VARCHAR(255),
  backup_codes TEXT[],
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  target VARCHAR(255),
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Import files table
CREATE TABLE IF NOT EXISTS user_import_files_idm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  import_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  imported_by UUID REFERENCES user_idm(id),
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_systems_name ON systems_idm(name);
CREATE INDEX IF NOT EXISTS idx_imported_users_email ON imported_users_idm(email);
CREATE INDEX IF NOT EXISTS idx_system_users_system_id ON system_users_idm(system_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Insert default admin user (password: admin123)
INSERT INTO user_idm (email, password, username, full_name, role) 
VALUES ('admin@idm.com', '$2b$10$xqvY8rFwm8jKqBx.4E0sFO7nWjQhKCcOPFtN8.2kQqPZQeKZYVbzq', 'admin', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert default user (password: 123456)
INSERT INTO user_idm (email, password, username, full_name, role) 
VALUES ('ricardo@idm.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ricardo', 'Ricardo Oliveira', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert default organization settings
INSERT INTO organization_settings (organization_name, timezone)
VALUES ('IDM Experience', 'America/Sao_Paulo')
ON CONFLICT DO NOTHING;


export interface System {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  created_at: string;
  hosting: string | null;
  access_type: string | null;
  responsible: string | null;
  sso_configuration: string | null;
  user_management_responsible: string | null;
  password_complexity: string | null;
  onboarding_type: string | null;
  offboarding_type: string | null;
  offboarding_priority: string | null;
  named_users: boolean | null;
  integration_type: string | null;
  region_blocking: string | null;
  mfa_configuration: string | null;
  mfa_policy: string | null;
  mfa_sms_policy: string | null;
  logs_status: string | null;
  log_types: any;
  version: string | null;
  integrated_users: boolean | null;
}

export interface QueryFilters {
  system: string;
  responsible: string;
  hosting: string;
  access: string;
  namedUsers: string;
  sso: string;
  integration: string;
  logTypes: string[];
  retention: string;
  versionFrom: string;
  versionTo: string;
}

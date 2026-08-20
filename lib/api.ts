const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: string;
  email: string;
  status: string;
  emailVerified: boolean;
}

export interface MeResponse {
  user: UserSummary;
  roles: Role[];
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  status: string;
  emailVerified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  legal_name: string;
  document: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationInput {
  name: string;
  legal_name?: string;
  document: string;
}

export interface RoleInput {
  code: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface PermissionInput {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor.");
  }

  if (!response.ok) {
    throw new Error("Falha ao carregar dados.");
  }
  return (await response.json()) as T;
}

const MOCK_ME: MeResponse = {
  user: {
    id: "usr-001",
    email: "admin@escola.com",
    status: "active",
    emailVerified: true,
  },
  roles: [
    {
      id: "role-admin",
      code: "administrador",
      name: "Administrador",
      description: "Acesso total à organização",
      permissions: [],
      createdAt: "",
      updatedAt: "",
    },
  ],
  permissions: [],
};

export async function getCurrentUser(token?: string | null): Promise<MeResponse> {
  if (!token) return MOCK_ME;
  try {
    return await request<MeResponse>("/api/v1/me", { token });
  } catch {
    return MOCK_ME;
  }
}

export function isAdmin(me: MeResponse): boolean {
  return me.roles.some(
    (r) =>
      r.name.toLowerCase().includes("admin") ||
      r.name.toLowerCase() === "administrador",
  );
}

const MOCK_ROLES: Role[] = [
  {
    id: "role-admin",
    code: "administrador",
    name: "Administrador",
    description: "Acesso total à organização",
    permissions: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "role-director",
    code: "diretor",
    name: "Diretor",
    description: "Opera unidades escolares atribuídas",
    permissions: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "role-assistant",
    code: "assistente",
    name: "Assistente",
    description: "Apoio administrativo na unidade",
    permissions: [],
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "role-teacher",
    code: "professor",
    name: "Professor",
    description: "Acesso a turmas e componentes atribuídos",
    permissions: [],
    createdAt: "",
    updatedAt: "",
  },
];

const MOCK_PERMISSIONS: Permission[] = [
  { id: "perm-1", name: "Listar papéis", resource: "roles", action: "read", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-2", name: "Criar papéis", resource: "roles", action: "write", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-3", name: "Listar permissões", resource: "permissions", action: "read", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-4", name: "Criar permissões", resource: "permissions", action: "write", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-5", name: "Listar usuários", resource: "users", action: "read", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-6", name: "Editar usuários", resource: "users", action: "write", description: "", isSystem: true, createdAt: "", updatedAt: "" },
  { id: "perm-7", name: "Excluir usuários", resource: "users", action: "delete", description: "", isSystem: true, createdAt: "", updatedAt: "" },
];

export async function getRoles(token?: string | null): Promise<Role[]> {
  if (!token) return MOCK_ROLES;
  try {
    return await request<Role[]>("/api/v1/roles", { token });
  } catch {
    return MOCK_ROLES;
  }
}

export async function createRole(token: string, input: RoleInput): Promise<Role> {
  return request<Role>("/api/v1/roles", { method: "POST", body: input, token });
}

export async function updateRole(
  token: string,
  id: string,
  input: RoleInput,
): Promise<Role> {
  return request<Role>(`/api/v1/roles/${id}`, { method: "PUT", body: input, token });
}

export async function deleteRole(token: string, id: string): Promise<void> {
  await request<unknown>(`/api/v1/roles/${id}`, { method: "DELETE", token });
}

export async function getPermissions(token?: string | null): Promise<Permission[]> {
  if (!token) return MOCK_PERMISSIONS;
  try {
    return await request<Permission[]>("/api/v1/permissions", { token });
  } catch {
    return MOCK_PERMISSIONS;
  }
}

export async function createPermission(
  token: string,
  input: PermissionInput,
): Promise<Permission> {
  return request<Permission>("/api/v1/permissions", {
    method: "POST",
    body: input,
    token,
  });
}

export async function updatePermission(
  token: string,
  id: string,
  input: PermissionInput,
): Promise<Permission> {
  return request<Permission>(`/api/v1/permissions/${id}`, {
    method: "PUT",
    body: input,
    token,
  });
}

export async function deletePermission(token: string, id: string): Promise<void> {
  await request<unknown>(`/api/v1/permissions/${id}`, {
    method: "DELETE",
    token,
  });
}

const MOCK_USERS: User[] = [
  { id: "usr-001", email: "admin@escola.com", status: "active", emailVerified: true },
  { id: "usr-002", email: "diretor@escola.com", status: "active", emailVerified: true },
  { id: "usr-003", email: "prof@escola.com", status: "active", emailVerified: true },
  { id: "usr-004", email: "assistente@escola.com", status: "active", emailVerified: true },
];

export interface UserDetail {
  user: User;
  roles: { id: string; name: string }[];
  permissions: { id: string; name: string }[];
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  status?: string;
  reason?: string;
}

export interface CreateAdminUserInput {
  email: string;
  password: string;
  registrationType: string;
  reason?: string;
}

export interface CreateAdminUserResponse {
  user: User;
  role: string;
}

export async function getUsers(token?: string | null): Promise<User[]> {
  if (!token) return MOCK_USERS;
  try {
    const res = await request<{ items: User[] }>("/api/v1/users", { token });
    return res.items;
  } catch {
    return MOCK_USERS;
  }
}

export async function getUser(token: string, id: string): Promise<UserDetail> {
  return request<UserDetail>(`/api/v1/users/${id}`, { token });
}

export async function updateUser(
  token: string,
  id: string,
  input: UserUpdateInput,
): Promise<User> {
  return request<User>(`/api/v1/users/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await request<unknown>(`/api/v1/users/${id}`, { method: "DELETE", token });
}

export async function createAdminUser(
  token: string,
  input: CreateAdminUserInput,
): Promise<CreateAdminUserResponse> {
  return request<CreateAdminUserResponse>("/api/v1/admin/users", {
    method: "POST",
    body: input,
    token,
  });
}

const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-001",
    name: "Escola Municipal Conecta",
    legal_name: "Escola Municipal Conecta LTDA",
    document: "12345678000199",
    status: "active",
    created_at: "",
    updated_at: "",
  },
];

export async function getOrganizations(
  token?: string | null,
): Promise<Organization[]> {
  if (!token) return MOCK_ORGANIZATIONS;
  try {
    const res = await request<{ items: Organization[] }>(
      "/api/v1/organizations",
      { token },
    );
    return res.items;
  } catch {
    return MOCK_ORGANIZATIONS;
  }
}

export async function createOrganization(
  token: string,
  input: OrganizationInput,
): Promise<Organization> {
  return request<Organization>("/api/v1/organizations", {
    method: "POST",
    body: input,
    token,
  });
}

export interface OrganizationUpdateInput {
  name?: string;
  legal_name?: string;
  document?: string;
  status?: string;
}

export async function getOrganization(
  token: string,
  id: string,
): Promise<Organization> {
  return request<Organization>(`/api/v1/organizations/${id}`, { token });
}

export async function updateOrganization(
  token: string,
  id: string,
  input: OrganizationUpdateInput,
): Promise<Organization> {
  return request<Organization>(`/api/v1/organizations/${id}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export async function deleteOrganization(token: string, id: string): Promise<void> {
  await request<unknown>(`/api/v1/organizations/${id}`, {
    method: "DELETE",
    token,
  });
}

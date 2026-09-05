const API_URL =
  process.env.NEXT_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3000';

import type { LoginResponse } from '@/lib/auth';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeResponse {
  user: User;
  roles: Role[];
  permissions: Permission[];
}

export interface RoleInput {
  name: string;
  description?: string;
}

export interface PermissionInput {
  name: string;
  resource: string;
  action: string;
}

export interface UserInput {
  name: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  active?: boolean;
}

export interface Page<T> {
  data: T[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  csrf?: string | null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token, csrf } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (csrf) {
    headers['X-CSRF-Token'] = csrf;
    headers.Cookie = `XSRF-TOKEN=${csrf}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 502);
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new ApiError(data?.error ?? 'Falha na requisição.', response.status);
  }

  if (response.status === 204 || response.status === 202) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export async function backendLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 502);
  }
  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
      code?: string;
    } | null;
    throw new ApiError(
      data?.error ?? 'Falha na autenticação.',
      response.status,
      data?.code,
    );
  }
  return (await response.json()) as LoginResponse;
}

export async function backendForgotPassword(email: string): Promise<void> {
  try {
    await request<void>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Falha ao solicitar recuperação.', 500);
  }
}

export async function revokeSession(
  token: string,
  refreshToken: string,
  csrf: string,
): Promise<void> {
  await request<void>('/auth/logout', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    token,
    csrf,
  });
}

const MOCK_USER: User = {
  id: 'usr-001',
  name: 'Admin',
  last_name: 'Escola',
  email: 'admin@escola.com',
  active: true,
  email_verified_at: null,
  created_at: '',
  updated_at: '',
};

const MOCK_ME: MeResponse = {
  user: MOCK_USER,
  roles: [
    {
      id: 'role-admin',
      name: 'Administrador',
      description: 'Acesso total',
      created_at: '',
      updated_at: '',
    },
  ],
  permissions: [],
};

export async function getCurrentUser(
  token?: string | null,
): Promise<MeResponse> {
  if (!token) return MOCK_ME;
  return request<MeResponse>('/auth/me', { token });
}

export function isAdmin(me: MeResponse): boolean {
  return me.roles.some((r) => r.name.toLowerCase().includes('admin'));
}

const MOCK_ROLES: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrador',
    description: 'Acesso total',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'role-director',
    name: 'Diretor',
    description: 'Opera unidades escolares atribuídas',
    created_at: '',
    updated_at: '',
  },
];

export async function getRole(token: string, id: string): Promise<Role> {
  return request<Role>(`/roles/${id}`, { token });
}

export async function getRoles(
  token?: string | null,
  page = 1,
  pageSize = 20,
): Promise<Page<Role>> {
  if (!token) {
    return {
      data: MOCK_ROLES,
      page,
      page_size: pageSize,
      total_items: MOCK_ROLES.length,
      total_pages: Math.max(1, Math.ceil(MOCK_ROLES.length / pageSize)),
    };
  }
  return request<Page<Role>>(`/roles?page=${page}&page_size=${pageSize}`, {
    token,
  });
}

export async function createRole(
  token: string,
  csrf: string,
  input: RoleInput,
): Promise<Role> {
  return request<Role>('/roles', { method: 'POST', body: input, token, csrf });
}

export async function updateRole(
  token: string,
  csrf: string,
  id: string,
  input: RoleInput,
): Promise<void> {
  await request<void>(`/roles/${id}`, {
    method: 'PUT',
    body: input,
    token,
    csrf,
  });
}

export async function deleteRole(
  token: string,
  csrf: string,
  id: string,
): Promise<void> {
  await request<void>(`/roles/${id}`, { method: 'DELETE', token, csrf });
}

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: 'perm-1',
    name: 'users:read',
    resource: 'users',
    action: 'read',
    created_at: '',
  },
  {
    id: 'perm-2',
    name: 'users:create',
    resource: 'users',
    action: 'create',
    created_at: '',
  },
  {
    id: 'perm-3',
    name: 'roles:read',
    resource: 'roles',
    action: 'read',
    created_at: '',
  },
  {
    id: 'perm-4',
    name: 'roles:create',
    resource: 'roles',
    action: 'create',
    created_at: '',
  },
];

export async function getPermission(
  token: string,
  id: string,
): Promise<Permission> {
  return request<Permission>(`/permissions/${id}`, { token });
}

export async function getPermissions(
  token?: string | null,
  page = 1,
  pageSize = 20,
): Promise<Page<Permission>> {
  if (!token) {
    return {
      data: MOCK_PERMISSIONS,
      page,
      page_size: pageSize,
      total_items: MOCK_PERMISSIONS.length,
      total_pages: Math.max(1, Math.ceil(MOCK_PERMISSIONS.length / pageSize)),
    };
  }
  return request<Page<Permission>>(
    `/permissions?page=${page}&page_size=${pageSize}`,
    { token },
  );
}

export async function createPermission(
  token: string,
  csrf: string,
  input: PermissionInput,
): Promise<Permission> {
  return request<Permission>('/permissions', {
    method: 'POST',
    body: input,
    token,
    csrf,
  });
}

export async function updatePermission(
  token: string,
  csrf: string,
  id: string,
  input: PermissionInput,
): Promise<void> {
  await request<void>(`/permissions/${id}`, {
    method: 'PUT',
    body: input,
    token,
    csrf,
  });
}

export async function deletePermission(
  token: string,
  csrf: string,
  id: string,
): Promise<void> {
  await request<void>(`/permissions/${id}`, { method: 'DELETE', token, csrf });
}

const MOCK_USERS: User[] = [MOCK_USER];

export async function getUser(token: string, id: string): Promise<User> {
  return request<User>(`/users/${id}`, { token });
}

export async function getUsers(
  token?: string | null,
  page = 1,
  pageSize = 20,
): Promise<Page<User>> {
  if (!token) {
    return {
      data: MOCK_USERS,
      page,
      page_size: pageSize,
      total_items: MOCK_USERS.length,
      total_pages: Math.max(1, Math.ceil(MOCK_USERS.length / pageSize)),
    };
  }
  return request<Page<User>>(`/users?page=${page}&page_size=${pageSize}`, {
    token,
  });
}

export async function createUser(
  token: string,
  csrf: string,
  input: UserInput,
): Promise<User> {
  return request<User>('/users', { method: 'POST', body: input, token, csrf });
}

export async function updateUser(
  token: string,
  csrf: string,
  id: string,
  input: UserUpdateInput,
): Promise<void> {
  await request<void>(`/users/${id}`, {
    method: 'PUT',
    body: input,
    token,
    csrf,
  });
}

export async function deleteUser(
  token: string,
  csrf: string,
  id: string,
): Promise<void> {
  await request<void>(`/users/${id}`, { method: 'DELETE', token, csrf });
}

export interface Invite {
  id: string;
  email: string;
  role_id: string;
  expires_at: string;
  accepted_at: string | null;
  invited_by: string;
  created_at: string;
  role: Role | null;
}

export interface InviteCreated {
  id: string;
  email: string;
  role_id: string;
  expires_at: string;
}

export interface InviteInfo {
  email: string;
  role_name: string;
  expires_at: string;
}

export async function getInvites(
  token?: string | null,
  page = 1,
  pageSize = 20,
): Promise<Page<Invite>> {
  if (!token) {
    return {
      data: [],
      page,
      page_size: pageSize,
      total_items: 0,
      total_pages: 0,
    };
  }
  return request<Page<Invite>>(`/invites?page=${page}&page_size=${pageSize}`, {
    token,
  });
}

export async function createInvite(
  token: string,
  csrf: string,
  input: { email: string; role_id: string },
): Promise<InviteCreated> {
  return request<InviteCreated>('/invites', {
    method: 'POST',
    body: input,
    token,
    csrf,
  });
}

export async function validateInvite(token: string): Promise<InviteInfo> {
  return request<InviteInfo>(`/invites/${token}`);
}

export async function acceptInvite(
  token: string,
  password: string,
): Promise<{ user: User }> {
  return request<{ user: User }>(`/invites/${token}/accept`, {
    method: 'POST',
    body: { password },
  });
}

export async function backendResetPassword(
  token: string,
  password: string,
): Promise<void> {
  await request<void>('/auth/reset-password', {
    method: 'POST',
    body: { token, password },
  });
}

export async function backendVerifyEmail(token: string): Promise<void> {
  await request<void>('/auth/verify-email', {
    method: 'POST',
    body: { token },
  });
}

export async function revokeAllSessions(
  token: string,
  csrf: string,
): Promise<void> {
  await request<void>('/auth/logout-all', { method: 'POST', token, csrf });
}

export async function getUserRoles(
  token: string,
  userId: string,
): Promise<Role[]> {
  const res = await request<Page<Role>>(
    `/users/${userId}/roles?page_size=100`,
    {
      token,
    },
  );
  return res.data;
}

export async function assignUserRoles(
  token: string,
  csrf: string,
  userId: string,
  roleIds: string[],
): Promise<void> {
  await request<void>(`/users/${userId}/roles`, {
    method: 'POST',
    body: { role_ids: roleIds },
    token,
    csrf,
  });
}

export async function removeUserRole(
  token: string,
  csrf: string,
  userId: string,
  roleId: string,
): Promise<void> {
  await request<void>(`/users/${userId}/roles/${roleId}`, {
    method: 'DELETE',
    token,
    csrf,
  });
}

export async function getRolePermissions(
  token: string,
  roleId: string,
): Promise<Permission[]> {
  const res = await request<Page<Permission>>(
    `/roles/${roleId}/permissions?page_size=100`,
    { token },
  );
  return res.data;
}

export async function assignRolePermissions(
  token: string,
  csrf: string,
  roleId: string,
  permissionIds: string[],
): Promise<void> {
  await request<void>(`/roles/${roleId}/permissions`, {
    method: 'POST',
    body: { permission_ids: permissionIds },
    token,
    csrf,
  });
}

export async function removeRolePermission(
  token: string,
  csrf: string,
  roleId: string,
  permissionId: string,
): Promise<void> {
  await request<void>(`/roles/${roleId}/permissions/${permissionId}`, {
    method: 'DELETE',
    token,
    csrf,
  });
}

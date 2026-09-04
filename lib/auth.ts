export interface LoginUser {
  id: string;
  name: string;
  last_name: string;
  email: string;
  active: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  csrf_token: string;
  user: LoginUser;
}

export class LoginError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "LoginError";
  }
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new LoginError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  const data = (await response.json().catch(() => null)) as
    | (LoginResponse & { error?: string; code?: string })
    | null;

  if (!response.ok) {
    if (response.status === 401) {
      throw new LoginError("Email ou senha inválidos.", response.status);
    }
    if (response.status === 403 && data?.code === "email_not_verified") {
      throw new LoginError(
        "Email não verificado. Confirme seu email antes de entrar.",
        response.status,
      );
    }
    if (response.status === 429) {
      throw new LoginError(
        "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
        response.status,
      );
    }
    throw new LoginError(
      data?.error ?? "Não foi possível entrar. Tente novamente em instantes.",
      response.status,
    );
  }

  return data as LoginResponse;
}

export async function forgotPassword(email: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new LoginError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new LoginError(
      data?.error ?? "Não foi possível enviar o email de recuperação.",
      response.status,
    );
  }
}
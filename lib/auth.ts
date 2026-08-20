const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

let accessToken: string | null = null;

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  csrfToken: string;
  user: {
    id: string;
    email: string;
    status: string;
    emailVerified: boolean;
  };
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

export function getAccessToken(): string | null {
  return accessToken;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
  } catch {
    throw new LoginError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new LoginError("Email ou senha inválidos.", response.status);
    }
    if (response.status === 429) {
      throw new LoginError(
        "Muitas tentativas de login. Aguarde alguns minutos e tente novamente.",
        response.status,
      );
    }
    throw new LoginError(
      "Não foi possível entrar. Tente novamente em instantes.",
      response.status,
    );
  }

  const data = (await response.json()) as LoginResponse;
  accessToken = data.accessToken;
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
  } catch {
    throw new LoginError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    );
  }

  if (!response.ok) {
    throw new LoginError(
      "Não foi possível enviar o email de recuperação. Tente novamente em instantes.",
      response.status,
    );
  }
}
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type SessionPayload = {
  id: number;
  role: "member" | "admin";
  name: string;
  email: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "rederm_session";
export const ADMIN_COOKIE = "rederm_admin_session";

// Use inside any /api/** route handler to authenticate the caller — middleware only
// guards page navigation under /dashboard and /admin, not API routes.
export async function getSessionFromRequest(
  req: NextRequest,
  cookieName: string
): Promise<SessionPayload | null> {
  const token = req.cookies.get(cookieName)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireMember(req: NextRequest): Promise<SessionPayload | null> {
  return getSessionFromRequest(req, SESSION_COOKIE);
}

export async function requireAdmin(req: NextRequest): Promise<SessionPayload | null> {
  return getSessionFromRequest(req, ADMIN_COOKIE);
}

import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE_NAME = "portfolio_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

const json = (payload, status = 200, headers = {}) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

const getAdminEnv = () => {
  const requiredEnvVars = [
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "ADMIN_SESSION_SECRET",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing admin environment variables: ${missingEnvVars.join(", ")}.`,
    );
  }

  return {
    username: process.env.ADMIN_USERNAME.trim(),
    password: process.env.ADMIN_PASSWORD.trim(),
    secret: process.env.ADMIN_SESSION_SECRET.trim(),
  };
};

const base64UrlEncode = (value) =>
  Buffer.from(value).toString("base64url");

const base64UrlDecode = (value) =>
  Buffer.from(value, "base64url").toString("utf8");

const signPayload = (payload, secret) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

const parseCookies = (request) =>
  (request.headers.get("cookie") || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, cookie) => {
      const separatorIndex = cookie.indexOf("=");

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = cookie.slice(0, separatorIndex);
      const value = cookie.slice(separatorIndex + 1);
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});

const isSecureRequest = (request) => {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  return forwardedProto === "https" || process.env.NODE_ENV === "production";
};

const createSessionCookie = (username, request) => {
  const { secret } = getAdminEnv();
  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      exp: Date.now() + SESSION_DURATION_SECONDS * 1000,
    }),
  );
  const signature = signPayload(payload, secret);
  const secure = isSecureRequest(request) ? "; Secure" : "";

  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    `${payload}.${signature}`,
  )}; Max-Age=${SESSION_DURATION_SECONDS}; Path=/; HttpOnly; SameSite=Strict${secure}`;
};

const clearSessionCookie = (request) => {
  const secure = isSecureRequest(request) ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict${secure}`;
};

export const getAdminSession = (request) => {
  try {
    const { secret } = getAdminEnv();
    const cookies = parseCookies(request);
    const cookieValue = cookies[SESSION_COOKIE_NAME];

    if (!cookieValue) {
      return { authenticated: false };
    }

    const [payload, providedSignature] = cookieValue.split(".");

    if (!payload || !providedSignature) {
      return { authenticated: false };
    }

    const expectedSignature = signPayload(payload, secret);
    const signaturesMatch = timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature),
    );

    if (!signaturesMatch) {
      return { authenticated: false };
    }

    const session = JSON.parse(base64UrlDecode(payload));

    if (!session?.username || !session?.exp || session.exp < Date.now()) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      username: session.username,
    };
  } catch {
    return { authenticated: false };
  }
};

export const requireAdminSession = (request) => {
  const session = getAdminSession(request);

  if (!session.authenticated) {
    return {
      ok: false,
      response: json({ error: "Unauthorized." }, 401),
    };
  }

  return {
    ok: true,
    session,
  };
};

export const handleAdminLogin = async (request) => {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  let adminEnv;

  try {
    adminEnv = getAdminEnv();
  } catch (error) {
    return json({ error: error.message }, 500);
  }

  const username = String(payload?.username || "").trim();
  const password = String(payload?.password || "").trim();

  if (!username || !password) {
    return json({ error: "Username and password are required." }, 400);
  }

  if (
    username !== adminEnv.username ||
    password !== adminEnv.password
  ) {
    return json({ error: "Invalid username or password." }, 401);
  }

  return json(
    {
      ok: true,
      username: adminEnv.username,
    },
    200,
    {
      "Set-Cookie": createSessionCookie(adminEnv.username, request),
    },
  );
};

export const handleAdminLogout = (request) =>
  json(
    {
      ok: true,
    },
    200,
    {
      "Set-Cookie": clearSessionCookie(request),
    },
  );

export const handleAdminSession = (request) => {
  let adminEnv;

  try {
    adminEnv = getAdminEnv();
  } catch (error) {
    return json({ error: error.message }, 500);
  }

  const session = getAdminSession(request);

  if (!session.authenticated) {
    return json({ authenticated: false, username: null });
  }

  return json({
    authenticated: true,
    username: session.username || adminEnv.username,
  });
};

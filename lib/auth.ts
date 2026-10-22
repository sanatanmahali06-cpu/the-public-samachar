import { SignJWT, jwtVerify } from "jose";

function getSecretKey() {
  const secret = process.env.REPORTER_JWT_SECRET;

  if (!secret) {
    throw new Error("REPORTER_JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function createReporterToken(reporterId: number) {
  return await new SignJWT({
    role: "reporter",
    reporterId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyReporterToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role !== "reporter") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createAdminToken(adminId: number) {
  return await new SignJWT({
    role: "admin",
    adminId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role !== "admin") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
export async function createManagerToken(managerId: number) {
  return await new SignJWT({
    role: "manager",
    managerId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyManagerToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.role !== "manager") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

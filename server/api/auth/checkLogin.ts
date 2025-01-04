// /api/check-login.ts
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const authHeader = event.node.req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Kein Token gefunden. Bitte einloggen.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    return { id: decoded.id, username: decoded.username };
  } catch (err) {
    console.error("Invalid token:", err);
    return { message: "Invalid token." };
  }
});

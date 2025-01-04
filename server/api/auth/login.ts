import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const conn = await connect();

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Alle Felder sind erforderlich.",
    });
  }

  try {
    const [rows] = await conn.execute(
      "SELECT user_id, password FROM User WHERE name = ?",
      [username],
    );
    // @ts-ignore
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError({
        statusCode: 401,
        message: "Ungültige Anmeldedaten.",
      });
    }

    const token = jwt.sign({ id: user.user_id, username }, secret);
    return {result: true, token, id: user.user_id, username}
  } catch (error) {
    throw createError({ statusCode: 500, message: "Fehler beim Login." });
  }
});

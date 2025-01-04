import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const { username: name, password } = await readBody(event);

  const conn = await connect();

  if (!name || !password) {
    throw createError({ statusCode: 400, message: 'Alle Felder sind erforderlich.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await conn.execute(
      'INSERT INTO User (name, password) VALUES (?, ?)',
      [name, hashedPassword]
    );
    return { message: 'Benutzer erfolgreich registriert!' };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Fehler bei der Registrierung.' });
  }
});

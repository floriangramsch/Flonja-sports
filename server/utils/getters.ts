import { connect, query } from "./db";

export const getWorkouts = async () => {
  const pool = await connect();

  const sql = `
      SELECT *
      FROM Workout w
      JOIN User u ON w.user_id = u.user_id
      ORDER BY start DESC
    `;

  const results = await query(pool, sql, []);

  return results;
};

export const getWorkout = async (id: number) => {
  const pool = await connect();

  const sql = `
      SELECT *
      FROM Workout w
      JOIN User u ON w.user_id = u.user_id
      WHERE workout_id = ?
    `;

  const results = await query(pool, sql, [id]);

  return results[0];
};

import { connect, query } from "./db";

export const getWorkouts = async () => {
  const pool = await connect();

  // const sql = `
  //     SELECT *
  //     FROM Workout w
  //     JOIN User u ON w.user_id = u.user_id
  //     ORDER BY start DESC
  //   `;

  const sql = `
    SELECT w.*, u.user_id, u.name, u.rest_time,
    (
      SELECT c.name FROM Workout_Exercise wex
      LEFT JOIN Exercise ex ON ex.exercise_id = wex.exercise_id
      LEFT JOIN Exercise_Category ec ON ex.exercise_id = ec.exercise_id
      LEFT JOIN Category c ON ec.category_id = c.category_id
      WHERE workout_id = w.workout_id
      GROUP BY c.name
      ORDER BY COUNT(c.name) DESC
      LIMIT 1) AS main_category
    FROM Workout w
    JOIN User u ON w.user_id = u.user_id
    ORDER BY w.start DESC;
  `;

  const results = await query(pool, sql, []);

  return results;
};

export const getWorkout = async (id: number) => {
  const pool = await connect();

  // const sql = `
  //     SELECT *
  //     FROM Workout w
  //     JOIN User u ON w.user_id = u.user_id
  //     WHERE workout_id = ?
  //   `;

  const sql = `
    SELECT w.*, u.user_id, u.name, u.rest_time,
    (
      SELECT c.name FROM Workout_Exercise wex
      LEFT JOIN Exercise ex ON ex.exercise_id = wex.exercise_id
      LEFT JOIN Exercise_Category ec ON ex.exercise_id = ec.exercise_id
      LEFT JOIN Category c ON ec.category_id = c.category_id
      WHERE workout_id = w.workout_id
      GROUP BY c.name
      ORDER BY COUNT(c.name) DESC
      LIMIT 1) AS main_category
    FROM Workout w
    JOIN User u ON w.user_id = u.user_id
    WHERE workout_id = ?;
  `;

  const results = await query(pool, sql, [id]);

  return results[0];
};

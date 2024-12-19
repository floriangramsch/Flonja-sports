import { connect, query } from "./db";
import mysql from "mysql2/promise";

interface ExerciseRow {
  equip_id: number;
  weight: number;
  start: string;
  user_id: number;
  exercice_id: number;
}

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

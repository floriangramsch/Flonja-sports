import { connect, query } from "./db";
import mysql from "mysql2/promise";

interface EquipRow {
  equip_id: number;
  equip_name: string;
  muscle_name: string;
}

interface ExerciseRow {
  equip_id: number;
  weight: number;
  start: string;
  user_id: number;
  exercice_id: number;
}

export const getEquips = async (): Promise<any> => {
  const pool = await connect();

  const sql = `
    SELECT equip_id, eq.name AS equip_name, m.muscle_group_id as muscle_id, m.name as muscle_name, info, type, metric
    FROM Equip eq
    LEFT JOIN MuscleGroup m 
    ON m.muscle_group_id = eq.muscle_group_id
  `;
  const equipResults: EquipRow[] = await query(pool, sql, []);

  return equipResults;
};

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

export const getExercisesByWorkout = async (
  id: number
): Promise<ExerciseRow[]> => {
  const pool = await connect();

  const sql = `
    SELECT exercice_id, eq.name AS equipName, e.equip_id, eq.muscle_group_id, m.name AS muscleName, type, metric 
    FROM Exercice e 
    LEFT JOIN Equip eq ON eq.equip_id = e.equip_id
    LEFT JOIN MuscleGroup m ON eq.muscle_group_id = m.muscle_group_id
    WHERE workout_id = ? 
  `;
  const results: ExerciseRow[] = await query(pool, sql, [id]);
  return results;
};

export const getSets = async (exercise_id: number) => {
  const pool = await connect();
  const sql = "SELECT * FROM `Set` WHERE exercise_id = ?";
  const results = await query(pool, sql, [exercise_id]);
  return results;
};

export const getLastSets = async (
  equip_id: number,
  user_id: number,
  start: Date
): Promise<ExerciseRow[]> => {
  const pool = await connect();

  const sql = `
    SELECT * FROM \`Set\` s
    LEFT JOIN Exercice e ON e.exercice_id = s.exercise_id
    RIGHT JOIN Workout w ON w.workout_id = e.workout_id
    WHERE equip_id = ?
    AND user_id = ?
    AND start = (
    SELECT MAX(start) FROM \`Set\` s
      LEFT JOIN Exercice e ON e.exercice_id = s.exercise_id
      RIGHT JOIN Workout w ON w.workout_id = e.workout_id
      WHERE equip_id = ?
      AND user_id = ?
      AND start < ?
    );
    `;
  const results = await query(pool, sql, [
    equip_id,
    user_id,
    equip_id,
    user_id,
    start,
  ]);
  return results;
};

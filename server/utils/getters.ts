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
  // export const getEquips = async (pool: mysql.Pool): Promise<any> => {
  const sql = `
  SELECT equip_id, eq.name AS equip_name, m.name as muscle_name 
  FROM Equip eq
  LEFT JOIN MuscleGroup m 
  ON m.muscle_group_id = eq.muscle_group_id
`;
  const equipResults: EquipRow[] = await query(pool, sql, []);

  const equips: { [key: number]: any } = {};

  for (const row of equipResults) {
    equips[Number(row.equip_id)] = {
      equip_name: row.equip_name,
      equip_muscle_name: row.muscle_name,
      exercises: {},
    };

    // Parallelisierung der Abfragen
    const [FloPB, SonjaPB, FloLast, SonjaLast] = await Promise.all([
      getPB(pool, row.equip_id, 1),
      getPB(pool, row.equip_id, 2),
      getLast(pool, row.equip_id, 1),
      getLast(pool, row.equip_id, 2),
    ]);

    equips[Number(row.equip_id)].FloPB = FloPB;
    equips[Number(row.equip_id)].SonjaPB = SonjaPB;
    equips[Number(row.equip_id)].FloLast = FloLast;
    equips[Number(row.equip_id)].SonjaLast = SonjaLast;
  }

  const exercises: ExerciseRow[] = await getExercises(pool);
  for (const row of exercises) {
    const equipId = row.equip_id;
    if (row.exercice_id) {
      if (!equips[equipId]["exercises"][row.user_id]) {
        equips[equipId]["exercises"][row.user_id] = {};
      }
      equips[equipId]["exercises"][row.user_id][row.exercice_id] = {
        weight: row.weight,
        start: row.start,
      };
    }
  }

  return equips;
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

// export const getWorkouts = async () => {
//   const pool = await connect();

//   const sql = `
//       SELECT *
//       FROM Workout w
//       JOIN User u ON w.user_id = u.user_id
//     `;

//   const results = await query(pool, sql, []);

//   const workouts: { [key: number]: any } = {};
//   const equipList = await getEquips();

//   for (const row of results) {
//     workouts[row.workout_id] = {
//       start: row.start,
//       end: row.end,
//       locker: row.locker,
//       user: {
//         id: row.user_id,
//         name: row.name,
//       },
//       equips: {},
//     };
//     for (const [key, value] of Object.entries(equipList)) {
//       const weight = await getWeight(pool, row.workout_id, Number(key));
//       workouts[row.workout_id].equips[key] = weight;
//     }
//   }
//   return workouts;
// };

const getExercises = async (pool: mysql.Pool): Promise<ExerciseRow[]> => {
  const sql = `
    Select eq.equip_id, e.weight, w.start, w.user_id, e.exercice_id
    FROM Equip eq 
    LEFT JOIN Exercice e ON eq.equip_id = e.equip_id 
    LEFT JOIN Workout w ON e.workout_id = w.workout_id
    `;
  const results: ExerciseRow[] = await query(pool, sql, []);
  return results;
};

export const getExercisesByWorkout = async (
  id: number
): Promise<ExerciseRow[]> => {
  const pool = await connect();

  const sql =
    " SELECT exercice_id, name AS equipName, e.equip_id FROM Exercice e LEFT JOIN Equip eq ON eq.equip_id = e.equip_id WHERE workout_id = ? ";
  const results: ExerciseRow[] = await query(pool, sql, [id]);
  return results;
};

const getPB = async (
  pool: mysql.Pool,
  equip_id: number,
  user_id: number
): Promise<number> => {
  const sql = `
    SELECT Max(e.weight) as PB FROM Exercice e
    LEFT JOIN Workout w ON w.workout_id = e.workout_id
    LEFT JOIN Equip eq ON eq.equip_id = e.equip_id
    WHERE e.equip_id = ? AND w.user_id = ?
  `;
  const results: any[] = await query(pool, sql, [equip_id, user_id]);
  return results[0].PB;
};

const getLast = async (
  pool: mysql.Pool,
  equip_id: number,
  user_id: number
): Promise<number | null> => {
  const sql = `
    SELECT e.weight FROM Exercice e
    LEFT JOIN Workout w ON w.workout_id = e.workout_id
    LEFT JOIN Equip eq ON eq.equip_id = e.equip_id
    WHERE e.equip_id = ? AND w.user_id = ?
    ORDER BY w.start DESC
    LIMIT 1;
  `;
  const results: any[] = await query(pool, sql, [equip_id, user_id]);
  return results.length > 0 ? results[0].weight : null;
};

const getWeight = async (
  pool: mysql.Pool,
  workout_id: number,
  equip_id: number
): Promise<number | null> => {
  const sql = `
    SELECT weight FROM Exercice e
    WHERE e.workout_id = ? AND e.equip_id = ?
  `;
  const exerciceResults = await query(pool, sql, [workout_id, equip_id]);

  return exerciceResults.length > 0 ? exerciceResults[0].weight : null;
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

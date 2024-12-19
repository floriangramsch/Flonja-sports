export const addWorkout = async (userId: number) => {
  const pool = await connect();
  const dateTime = new Date();

  const sql = `
      INSERT INTO Workout (user_id, start) VALUES (?, ?)
    `;

  try {
    const results = await query(pool, sql, [userId, dateTime]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Workout added successfully",
        workoutId: results.insertId,
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add Workout",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const addExercise = async (newExercise: {
  workout_id: number;
  exercise_id: number;
  weight?: string;
}) => {
  const pool = await connect();

  const sql = `
      INSERT INTO Workout_Exercise (workout_id, exercise_id${
        newExercise.weight !== undefined ? ", weight" : ""
      }) VALUES (?, ?${newExercise.weight !== undefined ? ", ?" : ""})
    `;

  const params = [newExercise.workout_id, newExercise.exercise_id];

  if (newExercise.weight !== undefined) {
    params.push(Number(newExercise.weight));
  }

  try {
    const results = await query(pool, sql, params);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Workout_Exercise added successfully",
        id: results.insertId,
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add Workout_Exercise",
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

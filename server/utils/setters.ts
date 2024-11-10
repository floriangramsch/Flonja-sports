export const addMuscle = async (newMuscle: string) => {
  const pool = await connect();

  const sql = `
      INSERT INTO MuscleGroup (name) VALUES (?)
    `;

  try {
    const results = await query(pool, sql, [newMuscle]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Muscle group added successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add muscle group",
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

export const addEquip = async (newEquip: {
  name: string;
  muscleGroupId: number;
}) => {
  const pool = await connect();

  const sql = `
      INSERT INTO Equip (name, muscle_group_id) VALUES (?, ?)
    `;

  try {
    const results = await query(pool, sql, [
      newEquip.name,
      newEquip.muscleGroupId,
    ]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Equip added successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add Equip",
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
  equip_id: number;
  weight?: string;
}) => {
  const pool = await connect();

  const sql = `
      INSERT INTO Exercice (workout_id, equip_id${
        newExercise.weight !== undefined ? ", weight" : ""
      }) VALUES (?, ?${newExercise.weight !== undefined ? ", ?" : ""})
    `;

  const params = [newExercise.workout_id, newExercise.equip_id];

  if (newExercise.weight !== undefined) {
    params.push(Number(newExercise.weight));
  }

  try {
    const results = await query(pool, sql, params);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Exercice added successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add Exercice",
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

export const addSet = async (
  exercise_id: number,
  weight: number,
  reps: number
) => {
  const pool = await connect();

  const sql =
    " INSERT INTO `Set` (exercise_id, weight, reps) VALUES (?, ?, ?) ";

  try {
    const results = await query(pool, sql, [exercise_id, weight, reps]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Set added successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to add Set",
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

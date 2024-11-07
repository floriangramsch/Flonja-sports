export const deleteExercise = async (id: number) => {
  const pool = await connect();

  const sql = `
        DELETE FROM Exercice WHERE exercice_id = ?
      `;

  try {
    const results = await query(pool, sql, [id]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Exercice removed successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to remove Exercice",
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

export const deleteWorkout = async (id: number) => {
  const pool = await connect();

  const sql = `
        DELETE FROM Workout WHERE workout_id = ?
      `;

  try {
    const results = await query(pool, sql, [id]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Workout removed successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to remove Workout",
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

export const deleteSet = async (id: number) => {
  const pool = await connect();

  const sql = " DELETE FROM `Set` WHERE id = ? ";

  try {
    const results = await query(pool, sql, [id]);
    if (results.affectedRows > 0) {
      return {
        statusCode: 200,
        message: "Set removed successfully",
      };
    } else {
      return {
        statusCode: 500,
        message: "Failed to remove Set",
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

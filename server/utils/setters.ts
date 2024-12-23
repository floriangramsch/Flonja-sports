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

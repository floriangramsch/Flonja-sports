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

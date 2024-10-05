export default defineEventHandler(async (event) => {
  const connection = await connect();

  const [rows] = await connection.execute(
    "SELECT muscle_group_id, name AS muscle_name FROM MuscleGroup"
  );
  return rows;
});

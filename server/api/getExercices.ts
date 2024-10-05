export default defineEventHandler(async (event) => {
  const connection = await connect();

  const [rows] = await connection.execute(
    `
    Select e.equip_id, weight, start 
    FROM Equip eq 
    LEFT JOIN Exercice e ON eq.equip_id = e.equip_id 
    LEFT JOIN Workout w ON e.workout_id = w.workout_id
    `
  );
  return rows;
});

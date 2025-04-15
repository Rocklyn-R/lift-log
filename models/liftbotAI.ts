import db from "../config/db";

export const getUserLogs = async (
    user_id: number
) => {
    const query = `SELECT 
    exercise_library.name as exercise_name,
  sets.date,
  sets.set_number,
  sets.exercise_order,
  sets."PR",
  sets.weight,
  sets.reps
FROM sets
JOIN exercise_library ON sets.exercise_id = exercise_library.id
WHERE sets.user_id = $1
ORDER BY sets.date DESC, sets.exercise_order ASC, sets.set_number ASC;
    `;

    try {
        const result = await db.query(query, [
            user_id
        ]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
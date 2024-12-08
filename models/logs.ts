import db from "../config/db";



export const toLogAdd = async (
    date: string,
    user_id: number,
    exercise_id: number,
    set_number: number,
    weight: number,
    reps: number
) => {
    const query = `
    INSERT INTO sets (date, user_id, exercise_id, set_number, weight, reps) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    try {
        const result = await db.query(query, [
            date, user_id, exercise_id, set_number, weight, reps
        ]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
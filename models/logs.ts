import db from "../config/db";



export const toLogAdd = async (
    date: string,
    user_id: number,
    exercise_id: number,
    set_number: number,
    weight: number,
    reps: number,
    exercise_order: number
) => {
    const query = `
    WITH inserted_set AS (
        INSERT INTO sets (date, user_id, exercise_id, set_number, weight, reps, exercise_order) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
    )
    SELECT 
        inserted_set.*,
        exercise_library.name AS exercise_name
    FROM 
        inserted_set
    JOIN 
        exercise_library 
    ON 
        inserted_set.exercise_id = exercise_library.id;`
    try {
        const result = await db.query(query, [
            date, user_id, exercise_id, set_number, weight, reps, exercise_order
        ]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const logGet = async (
    date: string,
    user_id: number
) => {
    const query = `
    SELECT 
    sets.*, 
    exercise_library.name AS exercise_name
FROM 
    sets
JOIN 
    exercise_library 
ON 
    sets.exercise_id = exercise_library.id
WHERE 
    sets.user_id = $1 
    AND sets.date = $2
ORDER BY 
    sets.exercise_order, 
    sets.set_number;`;
    console.log(user_id, date);
    try {
        const result = await db.query(query, [
            user_id, date
        ]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}
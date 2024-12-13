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
        console.log(error);
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

export const logEdit = async (
    weight: number,
    reps: number,
    set_id: number,
    user_id: number
) => {
    const query = `UPDATE sets SET weight = $1, reps = $2
    WHERE id = $3 AND user_id = $4 RETURNING *`;
    try {
        console.log(weight);
        const result = await db.query(query, [
            weight, reps, set_id, user_id
        ]);
        console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setDelete = async (
    set_id: number,
    user_id: number
) => {
    const query = `DELETE FROM sets WHERE id = $1 and user_id = $2
    `;

    try {
        const result = await db.query(query, [
            set_id, user_id
        ]);
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export const setNumberUpdate = async (
    set_id: number,
    user_id: number
) => {

    const query = `UPDATE sets SET set_number = set_number - 1 WHERE id = $1 and user_id = $2;`;
    try {
        const result = await db.query(query, [
            set_id, user_id
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const historyGet = async (
    user_id: number,
    exercise_id: number
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
    AND sets.exercise_id = $2
ORDER BY 
    sets.exercise_order, 
    sets.set_number;`;
    try {
        const result = await db.query(query, [
            user_id, exercise_id
        ]);
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const prsGet = async (
    user_id: number,
    exercise_id: number,
    date: string
) => {
    const query = `
    SELECT sets."PR", sets.id as set_id, sets.exercise_id, 
    exercise_library.name as exercise_name
    FROM sets
JOIN 
    exercise_library 
ON 
    sets.exercise_id = exercise_library.id
WHERE 
    sets.user_id = $1
    AND exercise_id = $2
    AND sets.date = $3`;
    try {
        const result = await db.query(query, [
            user_id, exercise_id, date
        ]);
        //console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
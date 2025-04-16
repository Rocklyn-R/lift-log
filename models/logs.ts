import { ChatCompletionsPage } from "openai/resources/chat";
import db from "../config/db";



export const toLogAdd = async (
    id: string,
    date: string,
    user_id: number,
    exercise_id: number,
    set_number: string,
    weight: number,
    weight_lbs: number,
    reps: number,
    exercise_order: number,
    PR: boolean
) => {
    const query = `
    WITH inserted_set AS (
        INSERT INTO sets (id, date, user_id, exercise_id, set_number, weight, weight_lbs, reps, exercise_order, "PR") 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
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
            id, date, user_id, exercise_id, set_number, weight, weight_lbs, reps, exercise_order, PR
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
    exercise_library.name AS exercise_name,
    sets.date::TEXT AS date 
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
    try {
        const result = await db.query(query, [
            user_id, date
        ]);
        console.log(result.rows)
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const logEdit = async (
    weight: number,
    reps: number,
    set_id: string,
    user_id: number,
    weight_lbs: number
) => {
    const query = `UPDATE sets SET weight = $1, reps = $2, weight_lbs = $3
    WHERE id = $4 AND user_id = $5 RETURNING *`;
    try {
        const result = await db.query(query, [
            weight, reps, weight_lbs, set_id, user_id
        ]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const setDelete = async (
    set_id: string,
    user_id: number
) => {
    const query = `DELETE FROM sets WHERE id = $1 and user_id = $2
    `;

    try {
        const result = await db.query(query, [
            set_id, user_id
        ]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export const setNumberUpdate = async (
    set_id: string,
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
    exercise_library.name AS exercise_name,
    sets.date::TEXT AS date 
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
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const orderChange = async (
    exercise_order: number,
    user_id: number,
    date: string,
    exercise_id: number,
) => {
    const query = `
    UPDATE sets 
    SET exercise_order = $1
    WHERE user_id = $2 AND date = $3 AND exercise_id = $4;`
    try {
        const result = await db.query(query, [
            exercise_order, user_id, date, exercise_id,
        ]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const datesGetAll = async (
    month: string,
    user_id: number
) => {
    console.log(month);
    const query = `SELECT DISTINCT TO_CHAR(date::DATE, 'YYYY-MM-DD') AS date
    FROM sets
    WHERE TO_CHAR(date::DATE, 'YYYY-MM') = $1 
    AND user_id = $2;`;
    try {
        const result = await db.query(query, [
            month, user_id
        ]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const allSetsDelete = async (exercise_id: number, user_id: number) => {
    const query = `DELETE FROM sets 
    WHERE exercise_id = $1 AND user_id = $2`;
    try {
        const result = await db.query(query, [
            exercise_id, user_id
        ]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const prUpdate = async (pr: boolean, set_id: string) => {
    console.log(pr);
    const query = `UPDATE sets SET "PR" = $1 WHERE id = $2`;
    try {
        const result = await db.query(query, [
            pr, set_id
        ]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
} 

export const exerciseDeleteFromLog = async (exercise_id: number, user_id: number, date: string) => {
    const query = `DELETE FROM sets 
    WHERE exercise_id = $1 AND user_id = $2 AND date = $3`;
    try {
        const result = await db.query(query, [
            exercise_id, user_id, date
        ]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const notesUpdate = async (id: string, user_id: number, notes: string, rir: string, rpe: string) => {
    const query = `UPDATE sets 
    SET notes = $1, "RIR" = $2, "RPE" = $3 
    WHERE id = $4 and user_id = $5;`
    try {
        const result = await db.query(query, [
            notes, rir, rpe, id, user_id
        ]);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const notesGet = async (id: string, user_id: number) => {
    const query = `SELECT "RPE", "RIR", notes 
    FROM sets 
    WHERE id = $1 AND user_id = $2`
    try {
        const result = await db.query(query, [id, user_id]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

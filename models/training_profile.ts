import db from "../config/db";

export const trainingProfileCreate = async (user_id: number) => {
    const query = `INSERT INTO training_profile (user_id) VALUES ($1) RETURNING *`;
    try {
        const result = await db.query(query, [
            user_id
        ]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

export const trainingProfileGet = async (user_id: number) => {
    const query = `SELECT * FROM training_profile WHERE user_id = $1`;
    try {
        const result = await db.query(query, [user_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const trainingGoalSet = async (user_id: number, training_goal: string) => {
    const query = `UPDATE training_profile SET training_goal = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [training_goal, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const bodyCompositionGoalSet = async (user_id: number, body_composition_goal: string) => {
    const query = `UPDATE training_profile SET body_composition_goal = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [body_composition_goal, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const injuriesSet = async (user_id: number, injuries: string) => {
    const query = `UPDATE training_profile SET injuries = $1
    WHERE user_id = $2`;
    try {
        const result = await db.query(query, [injuries, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}
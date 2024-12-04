import db from "../config/db";

export const userCreate = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string
) => {
    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
        const result = await db.query(query, [first_name, last_name, email, password]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
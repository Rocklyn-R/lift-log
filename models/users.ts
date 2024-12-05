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


export const userFindByEmail = async (email: string) => {
    const query = 'SELECT * FROM users where email = $1';
    try {
        const result = await db.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const userFindById = async (id: number) => {
    const query = 'SELECT * FROM users where id = $1';
    try {
        const result = await db.query(query, [id]);
        return result.rows[0]
    } catch (error) {
        throw error;
    }
};
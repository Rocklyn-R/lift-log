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

export const userUpdateEmail = async (id: number, email: string) => {
    const query = 'UPDATE users SET email = $1 where id = $2';
    try {
        const result = await db.query(query, [email, id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const userUpdatePassword = async (id: number, newPassword: string) => {
    const query = 'UPDATE users SET password = $1 where id = $2';
    try {
        const result = await db.query(query, [newPassword, id]);
        return result;
    } catch (error) {
        throw error;
    }
}

export const tokenAdd = async (user_id: number, token: string, expires_at: string) => {
    const query = "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)";
    try {
        const result = await db.query(query, [user_id, token, expires_at]);
        return result;
    } catch (error) {
        throw error;
    }
}


export const tokenCheck = async (token: string) => {
    const query = "SELECT * FROM password_resets WHERE token = $1";
    try {
        const result = await db.query(query, [token]);
        if (result.rows.length === 0) {
            return {valid: false, message: "Token not found", user_id: ""};
        }
        const resetData = result.rows[0];
        const currentTime = Date.now();
        const expiresAt = new Date(resetData.expires_at).getTime();
        if (currentTime > expiresAt) {
            return {valid: false, message: "Token expired", user_id: ""}
        }
        return {valid: true, message: "Token valid", user_id: resetData.user_id};
    } catch (error) {
        throw error;
    }
}

export const passwordReset = async (password: string, user_id: number) => {
    const query = "UPDATE users SET password = $1 WHERE id = $2";
    try {
        const result = await db.query(query, [password, user_id]);
        return result;
    } catch (error) {
        throw error;
    }
}

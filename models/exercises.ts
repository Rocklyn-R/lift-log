import db from '../config/db';


export const categoriesGet = async () => {
    const query = `SELECT * FROM exercise_categories`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) { 
        throw error;
    }
}

import db from '../config/db';

const queryExecutor = async (query: string, params: any[] = []) => {
    try {
        const result = await db.query(query, params);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

export const categoriesGet = async () => {
    const query = `SELECT * FROM exercise_categories`;
    return queryExecutor(query);  // No parameters for this query
};


export const exercisesGet = async (id: string) => {
    const query = `
    SELECT 
      el.id as exercise_id, 
      el.name as exercise_name, 
      ec.name AS category_name, 
      et.name AS type_name
    FROM 
      exercise_library el
    JOIN 
      exercise_categories ec ON ec.id = el.category
    JOIN 
      exercise_types et ON et.id = el.type
    WHERE 
      el.category = $1`;
    return queryExecutor(query, [id]);  // Pass the id as the parameter
};


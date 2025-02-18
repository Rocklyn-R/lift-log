import db from '../config/db';

const queryExecutor = async (query: string, params: any[] = []) => {
  try {
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const defaultExercisesGet = () => {
  const query = `SELECT name, category, type FROM default_exercise_library`;
  return queryExecutor(query);
}

export const defaultsAddToLibrary = (user_id: number) => {
  const query = ` INSERT INTO exercise_library (name, category, type, user_id)
  SELECT name, category, type, $1 FROM default_exercise_library;
  `;
  return queryExecutor(query, [user_id])
};

export const categoriesGet = async () => {
  const query = `SELECT * FROM exercise_categories`;
  return queryExecutor(query);  // No parameters for this query
};


export const exercisesGet = async (id: string, user_id: number) => {
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
      el.category = $1
      AND el.user_id = $2
      ORDER BY 
  el.name ASC;`
  return queryExecutor(query, [id, user_id]);  // Pass the id as the parameter
};

export const exerciseCreate = async (name: string, category: number, type: number, user_id: number) => {
  const query = `INSERT INTO exercise_library (name, category, type, user_id) VALUES ($1, $2, $3, $4) RETURNING *`;
  return queryExecutor(query, [name, category, type, user_id])
};

export const exerciseUpdate = async (name: string, category: number, type: number, exercise_id: number, user_id: number) => {
  const query = `UPDATE exercise_library SET name = $1, category = $2, type = $3
  WHERE id = $4 AND user_id = $5`;
  return queryExecutor(query, [name, category, type, exercise_id, user_id])
}
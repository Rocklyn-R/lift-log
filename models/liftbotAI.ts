import db from "../config/db";
import { EXERCISE_ALIASES } from "AI/utilities/utilities";

export const getUserLogs = async (
  user_id: number,
  exerciseIds: number[],
) => {
  const query = `SELECT 
    exercise_library.name as exercise_name,
  sets.date,
  sets.set_number,
  sets.exercise_order,
  sets."PR",
  sets.weight as weight_in_kg,
  sets.weight_lbs as weight_in_lbs,
  sets.reps,
  sets."RPE",
  sets."RIR",
  sets.notes,
  sets.exercise_id
FROM sets
JOIN exercise_library ON sets.exercise_id = exercise_library.id
WHERE sets.user_id = $1 AND sets.exercise_id = ANY($2)
AND sets.date >= CURRENT_DATE - INTERVAL '3 months'
ORDER BY sets.date DESC, sets.exercise_order ASC, sets.set_number ASC;
    `;

  try {
    const result = await db.query(query, [
      user_id,
      exerciseIds
    ]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getPRData = async (user_id: number, exerciseIds: number[]) => {
  const query = `
  SELECT exercise_library.name as exercise_name,
  sets.date,
  sets.set_number,
  sets."PR",
  sets.weight as weight_in_kg,
  sets.weight_lbs as weight_in_lbs,
  sets.reps,
  sets."RPE",
  sets."RIR",
  sets.notes,
  sets.exercise_id
  FROM sets
  JOIN exercise_library ON sets.exercise_id = exercise_library.id
  WHERE sets.user_id = $1 AND sets."PR" = $2 AND sets.exercise_id = ANY($3)
AND sets.date >= CURRENT_DATE - INTERVAL '3 months'
ORDER BY sets.date DESC, sets.exercise_order ASC, sets.set_number ASC;
  `
  try {
    const result = await db.query(query, [
      user_id,
      true,
      exerciseIds
    ]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const exerciseMatchFind = async (partialName: string, user_id: number) => {
  const query = `
      SELECT id, name
      FROM exercise_library
      WHERE user_id = $1
      AND name ILIKE $2
    `;

  try {
    const singularName = partialName
      .trim()
      .toLowerCase()
      .replace(/(?<!s)s$/, ""); // Remove only single trailing 's', not 'ss'
    console.log(singularName);
    const result = await db.query(query, [user_id, singularName]);

    if (result.rows.length > 0) {
    console.log("RETURNING THIS")
      return result.rows;
    }

    // Alias fallback if no match found
    const aliasMatch = EXERCISE_ALIASES[singularName];
    if (aliasMatch) {
    console.log(aliasMatch);
    console.log("RUNNING");
      const aliasResult = await db.query(query, [user_id, aliasMatch]);
      if (aliasResult.rows.length > 0) return aliasResult.rows;
    } else {
      // "db" → "dumbbell" fallback if no alias matched
      if (singularName.includes("db")) {

        const replaced = singularName.replace(/db/g, "dumbbell");
        
        const dumbbellResult = await db.query(query, [user_id, replaced]);
        if (dumbbellResult.rows.length > 0) return dumbbellResult.rows;
      }
    }

    const queryPartial = `
      SELECT id, name
      FROM exercise_library
      WHERE user_id = $1
      AND NOT EXISTS (
  SELECT 1
  FROM unnest(string_to_array($2, ' ')) AS word
  WHERE name ILIKE '%' || word || '%' = false
)
    `;

    // Step 4: Partial match with original
    const partialResult = await db.query(queryPartial, [user_id, singularName]);
    if (partialResult.rows.length > 0) return partialResult.rows;

    // Step 5: Partial match with alias
    if (aliasMatch) {
      const aliasPartial = await db.query(queryPartial, [user_id, aliasMatch]);
      if (aliasPartial.rows.length > 0) return aliasPartial.rows;
    }

    // Step 6: Partial match with "dumbbell"
    if (singularName.includes("db")) {
      const replaced = singularName.replace(/db/g, "dumbbell");
      console.log("Runs")
      console.log(replaced)
      const dumbbellPartial = await db.query(queryPartial, [user_id, replaced]);
      if (dumbbellPartial.rows.length > 0) return dumbbellPartial.rows;
    }

    // No matches
    return [];
  } catch (error) {
    console.error("Error in exerciseMatchFind:", error);
    throw error;
  }
};

export const getGeneralLogs = async (user_id: number) => {
  const query = `SELECT 
  exercise_library.name as exercise_name,
    exercise_categories.name AS category_name,
sets.date,
sets.set_number,
sets.exercise_order,
sets."PR",
sets.weight as weight_in_kg,
sets.weight_lbs as weight_in_lbs,
sets.reps,
sets."RPE",
sets."RIR",
sets.notes,
sets.exercise_id
FROM sets
JOIN exercise_library ON sets.exercise_id = exercise_library.id
JOIN exercise_categories ON exercise_library.category = exercise_categories.id
WHERE sets.user_id = $1 AND sets.exercise_order = 1 AND sets.set_number = 1
AND sets.date >= CURRENT_DATE - INTERVAL '2 months'
ORDER BY sets.date DESC, sets.exercise_order ASC, sets.set_number ASC;
  `;
  try {
    const result = await db.query(query, [
      user_id
    ]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getGeneralPRData = async (user_id: number) => {
  const query = `
  SELECT exercise_library.name AS exercise_name,
  exercise_categories.name AS category_name,
  sets.date,
  sets.set_number,
  sets."PR",
  sets.weight as weight_in_kg,
  sets.weight_lbs as weight_in_lbs,
  sets.reps,
  sets."RPE",
  sets."RIR",
  sets.notes,
  sets.exercise_id
  FROM sets
  JOIN exercise_library ON sets.exercise_id = exercise_library.id
  JOIN exercise_categories ON exercise_library.category = exercise_categories.id
  WHERE sets.user_id = $1 AND sets."PR" = $2
AND sets.date >= CURRENT_DATE - INTERVAL '1 months'
ORDER BY sets.date DESC, sets.exercise_order ASC, sets.set_number ASC;
  `
  try {
    const result = await db.query(query, [
      user_id,
      true
    ]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export interface Exercise extends SelectedExercise {
}

/*export interface Workout {
    date: string; // ISO format, e.g., "2024-11-29"
    exercises: Exercise[];
}*/

export interface Category {
    id: number,
    name: string
}


export interface SelectedExercise {
    exercise_id: number,
    exercise_name: string,
    category_name: string,
    type_name: string,
    exercise_order: number
}

export interface Workout {
    date: string,
    exercise_id: number,
    exercise_name: string,
    exercise_order: number,
    sets: Set [],
}

export interface Set {
    weight: string,
    reps: number,
    set_number: number,
    set_id: string,
    pr: boolean,
    weight_lbs: string
}


export interface SelectedSet extends Set {
    exercise_id: number
}
export interface Set {
    weight: number;
    reps: number;
}

export interface Exercise {
    id: number;
    name: string;
    sets: Set[]
}

export interface Workout {
    date: string; // ISO format, e.g., "2024-11-29"
    exercises: Exercise[];
}

export interface Category {
    id: number,
    name: string
}

export interface Exercise {
    id: number,
    name: string,
    category_name: string,
    type_name: string,
}
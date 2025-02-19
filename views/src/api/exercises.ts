export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://lift-log-backend-1s77.onrender.com/exercises'
    : 'http://localhost:4000/exercises';


export const getDefaultExercises = async () => {
    try {
        const response = await fetch(`${BASE_URL}/default`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json();
        return data.defaultExercises;
    } catch (error) {
        console.log(error);
    }
}

export const copyDefaultsToLibrary = async () => {
    try {
        const response = await fetch(`${BASE_URL}/defaults`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        return response.ok
    } catch (error) {
        console.log(error);
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.log(error);
    }
}

export const getExercises = async (category_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/?category_id=${category_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.exercises;
    } catch (error) {
        console.log(error);
    }
}

export const createNewExercise = async (name: string, category: number, type: number) => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ name, category, type })
        })
        const data = await response.json();
        return data.exercise;
    } catch (error) {
        console.log(error);
    }
}

export const updateExercise = async (
    name: string,
    category: number,
    type: number,
    exercise_id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ name, category, type, exercise_id })
            })
            return response.ok
        } catch (error) {
            console.log(error);
        }
}

export const deleteExercise = async (exercise_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ exercise_id })
        })
        return response.ok
    } catch (error) {
        console.log(error);
    }
}
export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://lift-log-backend-1s77.onrender.com'
    : 'http://localhost:4000/logs';


export const addSetToLog = async (
    date: string,
    exercise_id: number,
    set_number: number,
    weight: number,
    reps: number,
    exercise_order: number
) => {
    try {
        const response = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ date, exercise_id, set_number, weight, reps, exercise_order })
        })
        const data = await response.json();
        return data.set;
    } catch (error) {
        console.log(error);
    }
}

export const getLog = async (date: string) => {
    try {
        const response = await fetch(`${BASE_URL}?date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.workout;
    } catch (error) {
        console.log(error);
    }
}

export const editLog = async (
    weight: number,
    reps: number,
    set_id: number,
    weight_lbs: number
) => {
    try {
        console.log(weight, reps, set_id);
        const response = await fetch(`${BASE_URL}/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ weight, reps, set_id, weight_lbs})
        })
        const data = await response.json();
        return data.updatedSet;
    } catch (error) {
        console.log(error);
    }
}

export const deleteSet = async (set_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ set_id })
        })
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const updateSetNumber = async (set_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/edit-set-number`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ set_id })
        })
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const getExerciseHistory = async (exercise_id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/history?exercise_id=${exercise_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.history;
    } catch (error) {
        console.log(error);
    }
}

export const getUpdatedPrs = async (exercise_id: number, date: string) => {
    try {
        const response = await fetch(`${BASE_URL}/prs?exercise_id=${exercise_id}&date=${date}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.prData;
    } catch (error) {
        console.log(error);
    }
}

export const reorderExercises = async (
    exercise_order: number,
    date: string,
    exercise_id: number
) => {
    try {
        const response = await fetch(`${BASE_URL}/reorder`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ exercise_order, date, exercise_id })
        })
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const getAllDates = async (month: string) => {
    try {
        const response = await fetch(`${BASE_URL}/dates?month=${month}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.dates;
    } catch (error) {
        console.log(error);
    }
}
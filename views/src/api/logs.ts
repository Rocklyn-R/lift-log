export const BASE_URL = process.env.NODE_ENV === 'production'
    ? ''
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
        console.log(date, exercise_id, set_number, weight, reps, exercise_order);
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
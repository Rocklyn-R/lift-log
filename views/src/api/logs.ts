export const BASE_URL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:4000/logs/';


export const addSetToLog = async (
    date: string,
    exercise_id: number,
    set_number: number,
    weight: number,
    reps: number
) => {
    try {
        console.log(date, exercise_id, set_number, weight, reps);
        const response = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ date, exercise_id, set_number, weight, reps })
        })
        const data = await response.json();
        console.log(data.set)
        return data.set;
    } catch (error) {
        console.log(error);
    }
}
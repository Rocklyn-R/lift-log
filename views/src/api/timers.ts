export const BASE_URL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:4000/timer';

export const addTimer = async (
    hours: number,
    minutes: number,
    seconds: number,
    seconds_left: number
) => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ hours, minutes, seconds, seconds_left })
        })
      
        return response.ok
    } catch (error) {
        console.log(error);
    }
}


export const getTimer = async () =>  {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
        })
      
        const data = await response.json();
        console.log(data.timer);
        return data.timer;
    } catch (error) {
        console.log(error);
    }
}
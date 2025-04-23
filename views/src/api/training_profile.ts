export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://lift-log-backend-1s77.onrender.com/training-profile' : 'http://localhost:4000/training-profile';



export const createTrainingProfile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
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

export const getTrainingProfile = async () => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.trainingProfile;
    } catch (error) {
        console.log(error);
    }
}

export const updateTrainingGoal = async (training_goal: string) => {
    try {
        const response = await fetch(`${BASE_URL}/training-goal`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ training_goal })
        })
   
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const updateBodyCompositionGoal = async (body_composition_goal: string) => {
    try {
        const response = await fetch(`${BASE_URL}/body-composition-goal`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ body_composition_goal })
        })
   
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}

export const updateInjuries = async (injuries: string) => {
    try {
        const response = await fetch(`${BASE_URL}/injuries`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ injuries })
        })
   
        return response.ok;
    } catch (error) {
        console.log(error);
    }
}
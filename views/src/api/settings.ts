export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://lift-log-backend-1s77.onrender.com/settings' : 'http://localhost:4000/settings';



export const createSettings = async () => {
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

export const getSettings = async () => {
    try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        })
        const data = await response.json();
        return data.settings;
    } catch (error) {
        console.log(error);
    }
}

export const updateUnitSystem = async (unit_system: string) => {
    try {
        const response = await fetch(`${BASE_URL}/unit-system`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ unit_system })
        })
        return response.ok
    } catch (error) {
        console.log(error);
    }
}

export const updateUserPassword = async (oldPassword: string, newPassword: string) => {
    try {
        const response = await fetch(`${BASE_URL}/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ oldPassword, newPassword })
        })

        const data = await response.json();
        if (response.ok) {
            return 'Success';
        } else if (!response.ok && data.message === 'Old password incorrect') {
            return 'Old password incorrect';
        } else {
            throw new Error('Failed to update user email')
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateTheme = async (theme: string) => {
    try {
        const response = await fetch(`${BASE_URL}/theme`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ theme })
        })
        return response.ok
    } catch (error) {
        console.log(error);
    }
}

export const sendConfirmationEmail = async (pending_email: string) => {
    try {
        const response = await fetch(`${BASE_URL}/email-pending`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ pending_email })
        })
        return response.ok
    } catch (error) {
        console.log(error);
    }
}

export const confirmNewEmail = async (pending_email_token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/confirm-email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ pending_email_token })
        })
        const data = await response.json();
        return data.email;
    } catch (error) {
        console.log(error);
    }
}
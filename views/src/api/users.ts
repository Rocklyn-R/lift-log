export const createNewUser = async (name: string, lastName: string, email: string, password: string) => {
    try {
        const response = await fetch('http://localhost:4000/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: name,
                last_name: lastName,
                email: email.toLowerCase(),
                password,
            }),
            credentials: 'include'
        });
        const responseData = await response.json();
        if (response.ok) {
            return { user: responseData.user };
        } else {
            if (responseData && responseData.message === 'Failed to create user') {
                return { error: 'User with this email already exists' };
            } else {
                return { error: 'An error occurred', details: responseData };
            }
        }
    } catch (error: any) {
        return { error: 'An error occurred', details: error.message };
    }
}
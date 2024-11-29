export const BASE_URL = process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:4000/exercises';


export const getCategories = async () => {
    try {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = await response.json();
        console.log(data);
        return data.categories;
    } catch (error) {
        console.log(error);
    }
}
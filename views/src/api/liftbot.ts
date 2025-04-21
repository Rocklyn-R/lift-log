export const BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://lift-log-backend-1s77.onrender.com/liftbot'
    : 'http://localhost:4000/liftbot';


export const sendMessage = async (
    messages: { role: string; content: string }[], 
    needsContext: boolean, 
    effort_scale: string,
    unit_system: string
) => {
 try {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({ messages, needsContext, effort_scale, unit_system })
        })
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.log(error);
    }
}
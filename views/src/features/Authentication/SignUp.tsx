import { useState } from "react"
import { createNewUser } from "../../api/users";
import { Header } from "../../components/Header";
import { setIsAuthenticated, setUserFirstName, setUserLastName, setUserEmail } from "../../redux-store/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setErrorMessage("Passwords don't match.")
            return;
        }
        try {
            const response = await createNewUser(firstName, lastName, email, password);
            if (response.error) {
                if (response.error === 'User with this email already exists') {
                    setErrorMessage("User with this email already exists. Try a different email.");
                } else {
                    setErrorMessage('Failed to sign up');
                }
            } else if (response.user) {
                dispatch(setIsAuthenticated(true));
                setErrorMessage("");
                dispatch(setUserFirstName(response.user.first_name));
                dispatch(setUserLastName(response.user.last_name));
                dispatch(setUserEmail(response.user.email));
                navigate('/logs');
            } else {
                setErrorMessage('An unexpected error occurred');
            }
        } catch (error: any) {
            setErrorMessage("Failed to sign up");
        }
        
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <Header text="Welcome to LogLift" />
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white h-fit p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-darkestPurple">Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="first-name"></label>
                            <input
                                value={firstName}
                                type="text"
                                id="first-name"
                                name="first-name"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="First name"
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last-name"></label>
                            <input
                                value={lastName}
                                type="text"
                                id="last-name"
                                name="last-name"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="Last name"
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email"></label>
                            <input
                                value={email}
                                type="text"
                                id="email"
                                name="email"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="E-mail"
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                            />
                        </div>


                        {/* Password Field */}
                        <div className="mb-4">
                            <label htmlFor="password"></label>
                            <input
                                value={password}
                                type="password"
                                id="password"
                                name="password"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="Password"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="repeat-password"></label>
                            <input
                                value={repeatPassword}
                                type="password"
                                id="repeat-password"
                                name="repeat-password"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="Repeat password"
                                onChange={(e) => {
                                    setRepeatPassword(e.target.value)
                                }}
                            />
                        </div>
                        {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-darkestPurple text-lightestPurple text-lg font-semibold p-3 rounded-md hover:bg-darkPurple focus:outline-none focus:ring-2 focus:ring-darkPurple"
                        >
                            Sign Up
                        </button>
                    </form>

                </div>
            </div>

        </div>
    )
}
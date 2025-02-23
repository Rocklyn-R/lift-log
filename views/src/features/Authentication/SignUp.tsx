import { useState } from "react"
import { createNewUser } from "../../api/users";
import { Header } from "../../components/Header";
import { setIsAuthenticated, setUserFirstName, setUserLastName, setUserEmail } from "../../redux-store/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { createSettings } from "../../api/settings";
import { Link } from "react-router-dom";
import { CustomPasswordInput } from "../../components/CustomPasswordInput";
import { Loading } from "../../components/Loading";
import { copyDefaultsToLibrary, getDefaultExercises } from "../../api/exercises";
import { CustomTextInput } from "../../components/CustomTextInput";

export const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
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
                await createSettings();
                const defaultAdds = await copyDefaultsToLibrary();
                console.log(defaultAdds);

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
            <Header text="Welcome to LiftLog" />
            <div className="dark:bg-darkestPurple flex-grow flex items-center justify-center">
                <div className="dark:bg-darkestPurple dark:border-2 dark:text-lightestPurple bg-white h-fit p-8 rounded-lg shadow-lg w-96 flex flex-col">
                    <h2 className="text-2xl font-semibold text-center mb-6 dark:text-lightestPurple text-darkestPurple">Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label htmlFor="first-name"></label>
                            <CustomTextInput
                                value={firstName}
                                name="first-name"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="First name"
                                onChange={setFirstName}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last-name"></label>
                            <CustomTextInput
                                value={lastName}
                                name="last-name"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="Last name"
                                onChange={setLastName}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email"></label>
                            <CustomTextInput
                                value={email}
                                name="email"
                                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                                placeholder="E-mail"
                                onChange={setEmail}
                            />
                        </div>


                        {/* Password Field */}

                        <CustomPasswordInput
                            value={password}
                            name="password"
                            className="mb-4"
                            placeholder="Password"
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />


                        <CustomPasswordInput
                            value={repeatPassword}
                            name="repeat-password"
                            className="mb-4"
                            placeholder="Repeat password"
                            onChange={(e) => {
                                setRepeatPassword(e.target.value)
                            }}
                        />

                        {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
                       
                            <Button
                                type="submit"
                                className="flex justify-center w-full text-lg font-semibold p-3 hover:bg-darkPurple focus:outline-none focus:ring-2 focus:ring-darkPurple"
                            >
                               {loading ? <Loading size="w-7 h-7" /> : "Sign Up"}
                            </Button>
                    </form>

                </div>
            </div>
            <div className="flex flex-col items-center pb-4 dark:text-lightestPurple">
                <span>or</span>
                <Link className="dark:text-lightestPurple text-darkestPurple hover:underline text-xl p-4" to="/signin">Sign In</Link>
            </div>
        </div>
    )
}
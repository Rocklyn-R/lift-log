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
import { copyDefaultsToLibrary } from "../../api/exercises";
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
        setErrorMessage("")
        if (password !== repeatPassword) {
            setErrorMessage("Passwords don't match.")
            setLoading(false);
            return;
        }
        try {
            const response = await createNewUser(firstName, lastName, email, password);
            if (response.error) {
                if (response.error === 'User with this email already exists') {
                    setErrorMessage("User with this email already exists.");
                    setLoading(false);
                } else {
                    setErrorMessage('Failed to sign up,');
                    setLoading(false);
                }
            } else if (response.user) {
                await createSettings();
                const defaultAdds = await copyDefaultsToLibrary();

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
            <div className="bg-darkestPurple flex-grow flex items-center justify-center">
                <div className=" dark:bg-darkestPurple border-2 border-mediumPurple dark:text-lightestPurple bg-lightPurple h-fit p-8 rounded-lg shadow-lg w-96 flex flex-col">
                    <h2 className="text-2xl font-semibold text-center mb-6 dark:text-lightestPurple text-darkestPurple">Sign Up</h2>
                    <form onSubmit={handleSignUp} className="relative">
                        <div className="mb-4">
                            <label htmlFor="first-name"></label>
                            <CustomTextInput
                                value={firstName}
                                name="first-name"
                                className="focus:ring-1 w-full ring-darkPurple"
                                placeholder="First name"
                                onChange={setFirstName}
                                required={true}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="last-name"></label>
                            <CustomTextInput
                                value={lastName}
                                name="last-name"
                                className="focus:ring-1 w-full ring-darkPurple"
                                placeholder="Last name"
                                onChange={setLastName}
                                required={true}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email"></label>
                            <CustomTextInput
                                value={email}
                                name="email"
                                className="focus:ring-1 w-full ring-darkPurple"
                                placeholder="E-mail"
                                onChange={setEmail}
                                required={true}
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
                            required={true}
                        />


                        <CustomPasswordInput
                            value={repeatPassword}
                            name="repeat-password"
                            className="mb-6"
                            placeholder="Repeat password"
                            onChange={(e) => {
                                setRepeatPassword(e.target.value)
                            }}
                            required={true}
                        />

                        {errorMessage === "Passwords don't match." && <p className="absolute -bottom-[1.2rem] left-[4.5rem] font-semibold text-red-800">{errorMessage}</p>}
                        {errorMessage === "Failed to sign up." && <p className="absolute -bottom-[1.2rem] left-[6rem] font-semibold text-red-800">{errorMessage}</p>}
                        {errorMessage === "User with this email already exists." && <p className="w-full absolute -bottom-[1.2rem] left-[2.2rem] font-semibold text-red-800">{errorMessage}</p>}
                        <Button
                            type="submit"
                            className="mb-4 flex justify-center w-full text-lg font-semibold p-3 hover:bg-darkPurple focus:outline-none focus:ring-2 focus:ring-darkPurple"
                        >
                            {loading ? <Loading size="w-7 h-7" /> : "Sign Up"}
                        </Button>
                    </form>

                </div>
            </div>
            <div className="flex flex-col items-center pb-4 bg-darkestPurple text-lightestPurple">
                <span>or</span>
                <Link className="text-lightestPurple hover:underline text-xl p-4" to="/signin">Sign In</Link>
            </div>
        </div>
    )
}
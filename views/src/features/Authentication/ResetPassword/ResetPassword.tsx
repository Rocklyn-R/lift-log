import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { checkToken, createNewPasswordWithToken } from "../../../api/users";
import { Button } from "../../../components/Button";
import { Loading } from "../../../components/Loading";
import { Header } from "../../../components/Header";
import { CustomPasswordInput } from "../../../components/CustomPasswordInput";


export const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [pending, setPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const [userId, setUserId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        // Call backend to verify the token
        const validateToken = async () => {
            try {
                if (token) {
                    console.log(token)
                    const response = await checkToken(token);
                    if (response.valid) {
                        setIsValid(true);  // Token is valid, show form
                        setUserId(response.user_id)
                    } else {
                        setIsValid(false);
                        if (response.message === "Token expired") {
                            setError(response.message);
                        } else {
                            setError(response.message)
                        }
                    }
                }
            } catch (error) {
                setError('Error verifying token');
            }
        };

        validateToken();
    }, [token]);

    const submitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setErrorMessage("");
        if (password !== passwordRepeat) {
            setErrorMessage("Passwords don't match. Try again.")
            setPending(false);
        } else {
            if (userId) {
                const passwordUpdate = await createNewPasswordWithToken(password, userId);
                console.log(passwordUpdate);
                if (passwordUpdate) {
                    setSuccessMessage(true);
                }
                setPending(false);
            }
        }
    }

    if (isValid === null) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <Loading />
            </div>
            
        )
    }

    if (isValid === false && error === "Token expired") {
        return (
            <div className="mt-2 w-full flex justify-center flex-col items-center">
                <h1 className="mb-8 text-3xl text-center font-bold">Reset Password</h1>
                <p>This link has expired.</p>
            </div>
        )
    }
    if (isValid === false && error === "Token not found") {
        return (
            <div className="mt-2 w-full flex justify-center flex-col items-center">
                <p>This page does not exist.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <Header text="Welcome to LogLift" />
            <div className="flex-grow flex items-center justify-center flex-col">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-darkPurple">Reset Password</h2>

                    {successMessage ? (
                        <div className='space-y-4 flex justify-center flex-col items-center'>
                            <p className="text-center text-darkestPurple">Password successfully updated! Log in with your new password.</p>
                            <Button type="button" onClick={() => navigate('/signin')} className="" >Go to Login Page</Button>
                        </div>
                    ) :
                        <form
                            id="login"
                            className="flex flex-col items-center"
                            onSubmit={submitNewPassword}
                        >
                            <div className="mb-4">
                                {/* Password Field */}

                                <CustomPasswordInput
                                    className="mb-6"
                                    value={password}
                                    name="password"
                                    placeholder="New Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/* Password Field */}
                                <CustomPasswordInput
                                className="mb-6"
                                    value={passwordRepeat}
                                    name="password"
                                    placeholder="Repeat password"
                                    onChange={(e) => setPasswordRepeat(e.target.value)}
                                />
                            </div>
                            {pending ? <Loading /> : <Button
                                type="submit"
                                className=""
                            >
                                Change Password
                            </Button>}
                            {errorMessage && <p className="">{errorMessage}</p>}
                        </form>}
                </div>
            </div>
        </div>
    )
}
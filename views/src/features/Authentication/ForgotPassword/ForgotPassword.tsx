
import { useState } from "react";
import { CustomTextInput } from "../../../components/CustomTextInput";
import { Loading } from "../../../components/Loading";
import { Header } from "../../../components/Header";
import { Button } from "../../../components/Button";
import { checkForUserEmail, sendResetEmail } from "../../../api/users";


export const ForgotPassword = ({ }) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [pending, setPending] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

     const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         setPending(true);
         setErrorMessage("");
         const lowerCaseEmail = email.toLocaleLowerCase()
         const emailCheckResult = await checkForUserEmail(lowerCaseEmail);
         if (emailCheckResult === "User not found") {
             setErrorMessage("No account associated with that email. Please try again.");
             setPending(false);
         }
         if (emailCheckResult === "User found") {
             const resetEmail = await sendResetEmail(lowerCaseEmail);
             setPending(false);
             setSuccessMessage(true)
         }
     } 

    return (
        <div className="flex flex-col w-full h-screen">
            <Header text="Welcome to LogLift" />
            <div className="dark:bg-darkestPurple flex-grow flex items-center justify-center flex-col">
                <div
                    className="dark:bg-darkestPurple border-2  bg-white p-8 rounded-lg shadow-lg w-fit"
                >
                    <h4 className="text-xl font-semibold text-center mb-6 dark:text-lightestPurple text-darkPurple">{successMessage ? "An email has been sent to:" : "Enter your email to reset your password:"}</h4>
                    {successMessage ?
                        <div className=''>
                            <p className="font-semibold dark:text-lightestPurple text-center">{email.toLocaleLowerCase()}</p>
                        </div> : (
                            <form
                                onSubmit={handleSubmitEmail}
                                id="reset-password"
                                className="flex flex-col justify-center items-center space-y-4"
                            >
                          
                                    <CustomTextInput
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(newValue) => setEmail(newValue)}
                                        className="w-fit"
                                    />
                          
                                {pending ? <Loading size="h-12 w-12" /> :
                                    <Button
                                        type="submit"
                                        className=""
                                    >
                                        Submit
                                    </Button>}
                                {errorMessage && <p className="">{errorMessage}</p>}
                            </form>
                        )}
                </div>
            </div>
        </div>

    )
}

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
         console.log(lowerCaseEmail);
         const emailCheckResult = await checkForUserEmail(lowerCaseEmail);
         if (emailCheckResult === "User not found") {
             setErrorMessage("No account associated with that email. Please try again.");
             setPending(false);
         }
         if (emailCheckResult === "User found") {
             console.log(emailCheckResult);
             const resetEmail = await sendResetEmail(lowerCaseEmail);
             console.log(resetEmail)
             setPending(false);
             setSuccessMessage(true)
         }
     } 

    return (
        <div className="flex flex-col w-full h-screen">
            <Header text="Welcome to LogLift" />
            <div className="flex-grow flex items-center justify-center flex-col">
                <div
                    className="bg-white p-8 rounded-lg shadow-lg w-fit"
                >
                    <h4 className="text-xl font-semibold text-center mb-6 text-darkPurple">{successMessage ? "An email has been sent to:" : "Enter your email to reset your password:"}</h4>
                    {successMessage ?
                        <div className=''>
                            <p className="font-semibold text-center">{email.toLocaleLowerCase()}</p>
                        </div> : (
                            <form
                                onSubmit={handleSubmitEmail}
                                id="reset-password"
                                className="flex flex-col justify-center items-center space-y-4"
                            >
                                <div className="">
                                    <CustomTextInput
                                        name="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(newValue) => setEmail(newValue)}
                                    />
                                </div>
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
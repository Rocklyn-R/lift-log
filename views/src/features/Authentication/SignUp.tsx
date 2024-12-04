import { useState } from "react"
import { Header } from "../../components/Header";

export const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleSignUp = () => {
        
    }

    return (
        <div className="flex flex-col w-full h-screen">
            <Header text="Welcome to LogLift" />
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white h-fit p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-center mb-6 text-darkestPurple">Sign Up</h2>
                    <form>
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
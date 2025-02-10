import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../components/Button";
import { setIsAuthenticated } from "../../redux-store/UserSlice";
import { signInUser } from "../../api/users";
import { setUserFirstName, setUserLastName, setUserEmail } from "../../redux-store/UserSlice";
import { Link } from "react-router-dom";
import { Header } from "../../components/Header";
import { CustomPasswordInput } from "../../components/CustomPasswordInput";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Make a POST request to your server's signup endpoint using fetch
      const response = await signInUser(email, password);
      if (response.error) {
        setErrorMessage('Incorrect email or password. Try again.');
        setEmail('');
        setPassword('');
        return;
      } else {
        setErrorMessage('');
        dispatch(setIsAuthenticated(true));
        dispatch(setUserFirstName(response.user.first_name));
        dispatch(setUserLastName(response.user.last_name));
        dispatch(setUserEmail(response.user.email));

      }

    } catch (error: any) {
      console.log('Error signing up:', error.message);
    }
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <Header text="Welcome to LogLift" />
      <div className="flex-grow flex items-center justify-center flex-col">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-6 text-darkPurple">Sign In</h2>

          <form onSubmit={handleLogin}>
            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700"></label>
              <input
                value={email}
                type="text"
                id="username"
                name="username"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkPurple"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700"></label>
              <CustomPasswordInput
                value={password}
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMessage && <p className="mt-6 text-red-800">{errorMessage}</p>}
            <Button
              type="submit"
              className="w-full text-lg font-semibold p-3 hover:bg-darkPurple focus:outline-none focus:ring-2 focus:ring-darkPurple"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="/forgot-password" className="text-sm text-mediumPurple hover:underline">Forgot Password?</a>
          </div>
        </div>
        <div className="flex flex-col p-4 items-center">
          <span>or</span>
          <Link className="hover:underline text-xl p-4" to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};
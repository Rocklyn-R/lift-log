import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './features/Navigation/Navigation';
import { LogsPage } from './features/LogsPage/LogsPage';
import { SignIn } from './features/Authentication/SignIn';
import { ExerciseLibrary } from './features/ExerciseLibrary/ExerciseLibrary';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsLoading } from './redux-store/UserSlice';
import { SignUp } from './features/Authentication/SignUp';
import { useUserFetch } from './hooks/useUserFetch';
import { Loading } from './components/Loading';
import { useLogsFetch } from './hooks/useLogsFetch';
import { useState } from 'react';
import { TimeTools } from './features/TimeTools/TimeTools';
import { useTimerFetch } from './hooks/useTimerFetch';
import { Settings } from './features/Settings/Settings';
import { useSettingsFetch } from './hooks/useSettingsFetch';
import { ForgotPassword } from './features/Authentication/ForgotPassword/ForgotPassword';
import { ResetPassword } from './features/Authentication/ResetPassword/ResetPassword';
import { selectTheme, changeTheme } from './redux-store/SettingsSlice';
import { useEffect } from 'react';
import { ConfirmEmail } from './features/Authentication/ConfirmEmail/ConfirmEmail';
import { useCategoriesFetch } from './hooks/useCatgoriesFetch';
import { useDispatch } from 'react-redux';
import { LiftBot } from './features/LiftBot/LiftBot';
import { TrainingProfile } from './features/TrainingProfile/TrainingProfile';
import { useTrainingProfileFetch } from './hooks/useTrainingGoalsFetch';


function App() {
  useUserFetch();
  useLogsFetch();
  useTimerFetch();
  useTrainingProfileFetch();
  useSettingsFetch();
  useCategoriesFetch();

  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch()

      // Dynamically set the dark class on the HTML element
      useEffect(() => {
        if (theme === "Dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }, [theme]);

      useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            dispatch(changeTheme(savedTheme)); // Apply saved theme
        }
    }, [dispatch]);
  

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen dark:bg-darkestPurple bg-lightestPurple">
        <Loading />
      </div>
    );
  }


  return (
    <BrowserRouter>
      <div className="flex w-full h-screen dark:bg-darkestPurple bg-lightestPurple">

        {isAuthenticated && <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />}
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-45"
            onClick={() => setIsOpen(false)} // Close the menu on clicking the overlay
          ></div>
        )}
        <div className={`w-full h-screen overflow-y-auto`}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/logs" /> : <Navigate to="/signin" />
              }
            />
            {!isAuthenticated && (
              <>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path={'/reset-password/:token'} element={<ResetPassword />}
                />

              </>
            )}
            <>
              <Route path="/confirm-email/:token" element={<ConfirmEmail />} />
            </>
            {isAuthenticated && (
              <>
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/exercise-library" element={<ExerciseLibrary />} />
                <Route
                  path="/exercise-library/:categoryId"
                  element={<ExerciseLibrary />}
                />
                <Route
                  path="/time"
                  element={<TimeTools />}
                />
                <Route
                  path="/settings"
                  element={<Settings />}
                />
                <Route 
                  path="/liftbot"
                  element={<LiftBot />}
                />
                <Route 
                  path="/training-profile"
                  element={<TrainingProfile />}
                />
              </>
            )}
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/logs" : "/signin"} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

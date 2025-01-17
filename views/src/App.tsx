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

function App() {
  useUserFetch();
  useLogsFetch();
  useTimerFetch();
  
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-lightestPurple">
        <Loading />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex w-full h-screen bg-lightestPurple">

        {isAuthenticated && <Navigation isOpen={isOpen} setIsOpen={setIsOpen} />}
          {/* Overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-40"
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
              </>
            )}
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

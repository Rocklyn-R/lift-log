import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './features/Navigation/Navigation';
import { LogsPage } from './features/LogsPage/LogsPage';
import { SignIn } from './features/Authentication/SignIn';
import { ExerciseLibrary } from './features/ExerciseLibrary/ExerciseLibrary';
import { Exercises } from './features/ExerciseLibrary/Exercises/Exercises';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsLoading } from './redux-store/UserSlice';
import { SignUp } from './features/Authentication/SignUp';
import { useUserFetch } from './hooks/useUserFetch';
import { useState } from 'react';
import { Loading } from './components/Loading';
import { Header } from './components/Header';

function App() {
  useUserFetch();
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-lightestPurple">
        <Loading />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex w-full h-screen bg-lightestPurple overflow-y-auto">

        {isAuthenticated && <Navigation />}
        <div className="w-full h-screen">
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

import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './features/Navigation/Navigation';
import { LogsPage } from './features/LogsPage/LogsPage';
import { SignIn } from './features/Authentication/SignIn';
import { ExerciseLibrary } from './features/ExerciseLibrary/ExerciseLibrary';
import { Exercises } from './features/ExerciseLibrary/Exercises/Exercises';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './redux-store/UserSlice';
import { SignUp } from './features/Authentication/SignUp';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <BrowserRouter>
      {/* Main container for the app layout */}
      <div className="flex w-full h-screen bg-lightestPurple overflow-y-auto">
        {isAuthenticated && <Navigation />}
        <div className="w-full h-screen">
          <Routes>
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/logs" /> : <Navigate to="/signup" />}
            />
            
            {/* Logs page route */}
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
            <Route path="/exercise-library/:categoryId" element={<ExerciseLibrary />} />
            {/* SignIn page route */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

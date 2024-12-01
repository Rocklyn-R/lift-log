import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './features/Navigation/Navigation';
import { LogsPage } from './features/Logs/LogsPage/LogsPage';
import { SignIn } from './features/Authentication/SignIn';
import { ExerciseLibrary } from './features/ExerciseLibrary/ExerciseLibrary';
import { Exercises } from './features/ExerciseLibrary/Exercises/Exercises';

function App() {
  return (
    <BrowserRouter>
      {/* Main container for the app layout */}
      <div className="flex w-full h-screen bg-lightestPurple">
        <Navigation />
        <div className="w-full h-screen">
          <Routes>
            <Route
              path="/"
              //element={<Navigate to={isAuthenticated ? "/logs" : "/signin"} />}
            />
            
            {/* Logs page route */}
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/exercise-library" element={<ExerciseLibrary />} />
            <Route path="/exercise-library/:categoryId" element={<ExerciseLibrary />} />
            {/* SignIn page route */}
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

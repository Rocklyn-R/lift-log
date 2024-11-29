import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './features/Navigation/Navigation';
import { LogsPage } from './features/Logs/LogsPage/LogsPage';
import { SignIn } from './features/Authentication/SignIn';

function App() {
  return (
    <BrowserRouter>
      {/* Main container for the app layout */}
      <div className="flex w-full h-screen bg-lightestBlue">
        <Navigation />
        <div className="w-full h-screen">
          <Routes>
            <Route
              path="/"
              //element={<Navigate to={isAuthenticated ? "/logs" : "/signin"} />}
            />
            
            {/* Logs page route */}
            <Route path="/logs" element={<LogsPage />} />
            
            {/* SignIn page route */}
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

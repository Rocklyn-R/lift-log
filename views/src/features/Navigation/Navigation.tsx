import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Navigation = () => {
  const [selectedTab, setSelectedTab] = useState('');
  const location = useLocation();  // Hook to get the current location (pathname)

  useEffect(() => {
      // Get the pathname from the current location
      const pathname = location.pathname;

      // Set the selectedTab based on the pathname
      if (pathname.includes('/exercise-library')) {
          setSelectedTab('Exercises');
      } else if (pathname.includes('/logs')) {
          setSelectedTab('Logs');
      } else if (pathname.includes('/settings')) {
          setSelectedTab('Settings');
      } else if (pathname.includes('/rest-timer')) {
        setSelectedTab("Timer")
      }
      // Add more conditions as per your routes
  }, [location]);


  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-darkestPurple text-lightestPurple h-screen">
        <ul className="space-y-4 mt-4">
          <li>
            <Link
              to="/logs"
              className={`${selectedTab === 'Logs' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => setSelectedTab('Logs')}
            >
              Logs
            </Link>
          </li>
          <li>
            <Link
              to="/exercise-library"
              className={`${selectedTab === 'Exercises' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => setSelectedTab('Exercises')}
            >
              Exercise Library
            </Link>
          </li>
          <li>
            <Link
              to="/rest-timer"
              className={`${selectedTab === 'Timer' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => setSelectedTab('Timer')}
            >
              Rest Timer
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`${selectedTab === 'Settings' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => setSelectedTab('Settings')}
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
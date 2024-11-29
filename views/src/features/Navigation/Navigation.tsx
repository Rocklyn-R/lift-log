import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Navigation = () => {
    const [selectedTab, setSelectedTab] = useState('Logs');


  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 bg-darkestBlue text-lightestBlue h-screen">
        <ul className="space-y-4 mt-4">
          <li>
            <Link
              to="/logs"
              className={`${selectedTab === 'Logs' ? 'bg-darkBlue' : ''} block py-4 px-4 hover:bg-darkBlue rounded`}
              onClick={() => setSelectedTab('Logs')}
            >
              Logs
            </Link>
          </li>
          <li>
            <Link
              to="/exercise-library"
              className={`${selectedTab === 'Exercises' ? 'bg-darkBlue' : ''} block py-4 px-4 hover:bg-darkBlue rounded`}
              onClick={() => setSelectedTab('Exercises')}
            >
              Exercise Library
            </Link>
          </li>
          <li>
            <Link
              to="/rest-timer"
              className={`${selectedTab === 'Timer' ? 'bg-darkBlue' : ''} block py-4 px-4 hover:bg-darkBlue rounded`}
              onClick={() => setSelectedTab('Timer')}
            >
              Rest Timer
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`${selectedTab === 'Settings' ? 'bg-darkBlue' : ''} block py-4 px-4 hover:bg-darkBlue rounded`}
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
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFirstName } from '../../redux-store/UserSlice';
import { SignOut } from '../Authentication/SignOut';
import { useDispatch } from 'react-redux';
import { setSelectedDate } from '../../redux-store/LogsSlice';
import { getTodayDate } from '../../utilities/utilities';
import { FaBars } from "react-icons/fa6";

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: (arg0: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({isOpen, setIsOpen}) => {
  const [selectedTab, setSelectedTab] = useState('');
  //const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();  // Hook to get the current location (pathname)
  const userFirstName = useSelector(selectFirstName);
  const dispatch = useDispatch();

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


  /*<nav
  className={`fixed top-0 left-0 h-screen transition-transform duration-300 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } w-64 bg-darkestPurple text-lightestPurple z-50`}
>*/
  return (
    <div className="flex relative">
      {/* Sidebar */}
      <nav
        className={`z-50 fixed top-0 left-0 xl:static flex flex-col justify-between h-screen transition-width duration-300 ${isOpen ? 'w-64' : 'xl:w-64 w-16'
          } bg-darkestPurple text-lightestPurple`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='p-4 xl:hidden block absolute right-1 top-2'
        ><FaBars className='text-2xl' /></button>
        <ul className={`space-y-4 ${isOpen ? 'block' : 'xl:block hidden'}`}>
          <li>

            <p
              className="text-lg block py-5 px-4 rounded font-semibold italic text-lightestPurple"
            >
              Welcome, {userFirstName}!
            </p>



          </li>
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
              onClick={() => {
                setSelectedTab('Exercises')
                dispatch(setSelectedDate(getTodayDate()))
              }}
            >
              Exercise Library
            </Link>
          </li>
          <li>
            <Link
              to="/rest-timer"
              className={`${selectedTab === 'Timer' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => {
                setSelectedTab('Timer')
                dispatch(setSelectedDate(getTodayDate()))
              }}
            >
              Rest Timer
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`${selectedTab === 'Settings' ? 'bg-darkPurple' : ''} block py-4 px-4 hover:bg-darkPurple rounded`}
              onClick={() => {
                setSelectedTab('Settings');
                dispatch(setSelectedDate(getTodayDate()))
              }}
            >
              Settings
            </Link>
          </li>
        </ul>
        <SignOut isOpen={isOpen} />
      </nav>
    </div>
  );
};
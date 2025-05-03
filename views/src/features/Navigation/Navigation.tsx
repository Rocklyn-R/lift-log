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
    } else if (pathname.includes('/settings') || pathname.includes('/confirm-email')) {
      setSelectedTab('Settings');
    } else if (pathname.includes('/clock')) {
      setSelectedTab("Time")
    } else if (pathname.includes('/liftbot')) {
      setSelectedTab("LiftBot")
    } else if (pathname.includes('/training-profile')) {
      setSelectedTab("Training Profile")
    }
    // Add more conditions as per your routes
  }, [location]);


  /*<nav
  className={`fixed top-0 left-0 h-screen transition-transform duration-300 transform ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } w-64 bg-darkestPurple text-lightestPurple z-50`}
>*/
  return (
    <div className="flex relative z-48">
      {/* Sidebar */}
      <nav
        className={`dark:border-r-2 dark:border-mediumPurple z-48 fixed top-0 left-0 xl:static flex flex-col justify-between h-screen transition-width duration-300 ${isOpen ? 'w-64' : 'xl:w-64 w-16'
          } bg-darkest text-lightestPurple`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='p-4 xl:hidden block absolute right-1 top-2'
        ><FaBars className='text-2xl' /></button>
        <ul className={`font-semibold space-y-4 ${isOpen ? 'block' : 'xl:block hidden'}`}>
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
              className={`${selectedTab === 'Logs' ? ' bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 hover:bg-darkPurple border-y-2`}
              onClick={() => {
                setSelectedTab('Logs');
                setIsOpen(false);
              }}
            >
              Logs
            </Link>
          </li>
          <li>
            <Link
              to="/exercise-library"
              className={`${selectedTab === 'Exercises' ? 'bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 dark:hover:border-y-2 border-y-2 hover:bg-darkPurple`}
              onClick={() => {
                setSelectedTab('Exercises')
                dispatch(setSelectedDate(getTodayDate()))
                setIsOpen(false);
              }}
            >
              Exercise Library
            </Link>
          </li>
          <li>
            <Link
              to="/training-profile"
              className={`${selectedTab === 'Training Profile' ? 'bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 dark:hover:border-y-2 border-y-2 hover:bg-darkPurple`}
              onClick={() => {
                setSelectedTab('Training Profile')
                dispatch(setSelectedDate(getTodayDate()));
                setIsOpen(false);
              }}
            >
              Training Profile
            </Link>
          </li>
          <li>
            <Link
              to="/time"
              className={`${selectedTab === 'Time' ? 'bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 dark:hover:border-y-2 border-y-2 hover:bg-darkPurple`}
              onClick={() => {
                setSelectedTab('Time')
                dispatch(setSelectedDate(getTodayDate()));
                setIsOpen(false);
              }}
            >
              Time Tools
            </Link>
          </li>
          <li>
            <Link
             to="/liftbot"
             className={`${selectedTab === 'LiftBot' ? 'bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 dark:hover:border-y-2 border-y-2 hover:bg-darkPurple`}
             onClick={() => {
               setSelectedTab('LiftBot')
               dispatch(setSelectedDate(getTodayDate()));
               setIsOpen(false);
             }}
            >
              LiftBot
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`${selectedTab === 'Settings' ? 'bg-darkPurple border-y-2 dark:border-mediumPurple border-transparent' : 'border-transparent dark:hover:bg-lightestPurple dark:hover:text-darkestPurple'} block py-4 px-4 dark:hover:border-y-2 border-y-2 hover:bg-darkPurple`}
              onClick={() => {
                setSelectedTab('Settings');
                dispatch(setSelectedDate(getTodayDate()));
                setIsOpen(false);
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
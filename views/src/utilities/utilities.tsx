export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Extract the YYYY-MM-DD part
};

export const formatDate = (dateString: string) => {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Normalize both dates to the same time to avoid issues with time of day
  currentDate.setHours(0, 0, 0, 0);  // Current date with time set to midnight
  inputDate.setHours(0, 0, 0, 0);    // Input date with time set to midnight

  const timeDiff = inputDate.getTime() - currentDate.getTime();
  const oneDayInMillis = 1000 * 60 * 60 * 24;

  if (timeDiff === 0) {
    return 'Today';
  } else if (timeDiff === oneDayInMillis) {
    return 'Tomorrow';
  } else if (timeDiff === -oneDayInMillis) {
    return 'Yesterday';
  } else {
    // Format the input date for user’s local time zone
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // 'long' for full weekday name (e.g., "Monday")
      month: 'long',    // 'long' for full month name (e.g., "November")
      day: 'numeric'    // 'numeric' for day number (e.g., "29")
    };

    return inputDate.toLocaleDateString(undefined, options);  // undefined uses user's local time zone
  }
}

export const adjustDate = (direction: 'back' | 'forward', dateString: string): string => {
  const inputDate = new Date(dateString);

  // Ensure that we're dealing with the correct date format and adjust the day
  if (direction === 'back') {
    inputDate.setDate(inputDate.getDate() - 1);  // Subtract one day
  } else if (direction === 'forward') {
    inputDate.setDate(inputDate.getDate() + 1);  // Add one day
  }

  // Format the date back to 'YYYY-MM-DD'
  const year = inputDate.getFullYear();
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');  // Month is 0-indexed
  const day = inputDate.getDate().toString().padStart(2, '0');           // Ensure two digits for the day

  return `${year}-${month}-${day}`;  // Return the date in 'YYYY-MM-DD' format
};


export const formatNumber = (numberString: string) => {
  // Convert the string to a number and back to string to remove trailing zeros
  const num = parseFloat(numberString);

  // If the number is an integer, return it as a string with ".0" appended
  if (Number.isInteger(num)) {
    return num.toFixed(1); // Adds ".0" to integers
  }

  // Otherwise, remove trailing zeros after the decimal
  return num.toString().replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

export const formatDateForHistory = (dateString: string): string => {
  const date = new Date(dateString);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Day of the week (e.g., "Friday")
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });

  // Month (e.g., "December")
  const month = date.toLocaleString('en-US', { month: 'long' });

  // Day of the month (e.g., 13)
  const day = date.getDate();

  // Format the date with the suffix
  const formattedDate = `${dayOfWeek}, ${month} ${day}`;

  // If the year is not the current year, add it to the string
  const year = date.getFullYear();
  if (year !== currentYear) {
    return `${formattedDate}, ${year}`;
  }

  return formattedDate;
}

// Helper function to get the days of a month
export const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 0);
  const totalDays = date.getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // getDay() returns 0 for Sunday, 1 for Monday, etc.
  return { totalDays, firstDayOfMonth };
};

export const getYearMonth = (date: Date) => {
  const year = date.getFullYear(); // Extracts the year (e.g., 2025)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Extracts the month (0-11, so add 1) and pads with leading zero if needed
  return `${year}-${month}`; // Format as 'YYYY-MM'
}
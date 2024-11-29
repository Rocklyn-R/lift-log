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
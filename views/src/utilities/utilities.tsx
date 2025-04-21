import e from "express";
import { Workout } from "../types/types";

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

export interface SetData {
  weight: number,
  reps: number,
  date: string
}

export const findPRsOnInsert = (historyArray: Workout[], newSet: SetData) => {
  if (historyArray.length === 0) {
    return { newPR: true, removePRsSetIds: [] };
  }
  //const history = historyArray[0]
  // Find the highest weight (ignoring sets where reps = 0)
  const highestWeight = historyArray.reduce((maxWeight, history) => {
    return history.sets.reduce((max, set) => {
      const weight = parseFloat(set.weight);
      return set.reps > 0 && weight > max ? weight : max;
    }, maxWeight);
  }, 0);

  // Find the highest reps at the highest weight
  const highestRepsAtHighestWeight = historyArray.reduce((maxReps, history) => {
    return history.sets.reduce((max, set) => {
      return parseFloat(set.weight) === highestWeight ? Math.max(max, set.reps) : max;
    }, maxReps);
  }, 0);

  let newPR = false;
  let removePRsSetIds = [];

  
  //Case 1: If the new set has the highest weight
  if (newSet.weight > highestWeight) {

    newPR = true;
  }
  //Case 2: If the new set equals the highest weight but has more reps
  if (newSet.weight === highestWeight && newSet.reps > highestRepsAtHighestWeight) {
    newPR = true;
  };
  //Case 3: If the new set has a lower weight
  if (newSet.weight < highestWeight) {
    // Check if there is a higher weight with MORE reps than the new set
    const search = historyArray.some(history =>
      history.sets.some(set => Number(set.weight) >= newSet.weight && set.reps >= newSet.reps)
    );
    if (!search && newSet.reps > 0) {
      newPR = true;
    }
  }

  const existingPRsAtSameWeightAndReps = historyArray
  .flatMap(history => 
      history.sets.map(set => ({
          ...set,  // Spread existing set data
          date: history.date  // Include the history object's date
      }))
  )
  .filter(set => set.pr === true && Number(set.weight) === newSet.weight && set.reps === newSet.reps);


  if (existingPRsAtSameWeightAndReps.length > 0) {


    const historyDate = new Date(existingPRsAtSameWeightAndReps[0].date);
    const newSetDate = new Date(newSet.date);
    if (historyDate > newSetDate) {
      newPR = true;
      removePRsSetIds.push(existingPRsAtSameWeightAndReps[0].set_id)
    }
  }

  const foundSets = historyArray
    .flatMap(history => history.sets) // Flatten all sets across historyArray
    .filter(set =>
      (set.pr === true && Number(set.weight) < newSet.weight && set.reps <= newSet.reps) ||
      (set.pr === true && Number(set.weight) === newSet.weight && set.reps < newSet.reps)
    );

  const setIdsToRemove = foundSets.map(set => set.set_id);
  removePRsSetIds.push(...setIdsToRemove);

  return {
    newPR,
    removePRsSetIds
  }
}

export const findPRsOnCopy = (workoutToCopy: Workout[], selectedDate: string): string[] => {
  const workoutToCopyDate = new Date(workoutToCopy[0].date);
  const copyingToDate = new Date(selectedDate);
  if (copyingToDate > workoutToCopyDate) {
    return [];
  } else {
    const allPrSetIds = workoutToCopy.flatMap(exercises => exercises.sets).filter(set => set.pr === true).map(set => set.set_id);
    return allPrSetIds;
  }
}

export const findPRsOnDelete = (historyArray: Workout[], deletedSetId: string) => {
   // Sort historyArray by date in ascending order (oldest to newest)
   const sortedHistory = [...historyArray].sort((a, b) => 
   new Date(a.date).getTime() - new Date(b.date).getTime()
 );
 const allSets = sortedHistory.flatMap(workout =>
  workout.sets.map(set => ({
    ...set,
    date: workout.date // attach workout's date to each set
  }))
);

  // Filter sets that should be marked as PR
  const setsToMarkAsPR = allSets.filter(set => {
    return (
      set.set_id !== deletedSetId &&  // Exclude deleted set from PR checks
      set.reps > 0 &&
      !allSets.some(y =>
        y.set_id !== deletedSetId &&  // Ensure deleted set isn't used for comparison
        (
          (Number(y.weight) > Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) === Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) > Number(set.weight) && y.reps === set.reps) ||
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() < new Date(set.date).getTime()) ||
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() === new Date(set.date).getTime() && y.set_number < set.set_number)
        )
      )
    );
  });



  // Return an array of set_id's that need PR = true
  return setsToMarkAsPR.map(set => set.set_id);
}

export interface UpdateSetData {
  weight: number,
  reps: number,
  set_id: string,
  pr: boolean,
  set_number: number
}

export const findPRsOnUpdate = (historyArray: Workout[], updatedSet: UpdateSetData) => {


  const allSets = historyArray.flatMap(workout => 
    workout.sets.map(set => ({
      ...set,
      date: workout.date
    })));
  // Create a copy of allSets with the updatedSet replacing the old version
  const updatedSets = allSets.map(set =>
    set.set_id === updatedSet.set_id ? {...updatedSet, date: set.date, pr: set.pr} : set
  );

  // Find sets that should be marked as PR
  const setsToMarkAsPR = updatedSets.filter(set => {
    return (
      set.reps > 0 &&
      set.pr === false &&
      !updatedSets.some(y =>
        y.set_id !== set.set_id && // Exclude self-comparison
        (
          (Number(y.weight) > Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) === Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) > Number(set.weight) && y.reps === set.reps) || 
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() < new Date(set.date).getTime()) ||
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() === new Date(set.date).getTime() && y.set_number < set.set_number)
        )
      )
    );
  });

  // Find sets that should have PR set to false
  const setsToRemovePR = updatedSets.filter(set => {
    return (
      set.reps > 0 &&
      set.pr === true &&
      updatedSets.some(y =>
        y.set_id !== set.set_id && // Exclude self-comparison
        (
          (Number(y.weight) > Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) === Number(set.weight) && y.reps > set.reps) ||
          (Number(y.weight) > Number(set.weight) && y.reps === set.reps) ||
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() < new Date(set.date).getTime()) ||
          (Number(y.weight) === Number(set.weight) && y.reps === set.reps && new Date(y.date).getTime() === new Date(set.date).getTime() && y.set_number < set.set_number)
        )
      )
    );
  });

  // Convert arrays to sets for faster lookup
  const setPRFalseIds = new Set(setsToRemovePR.map(set => set.set_id));

  // Filter out any set_id in setPRTrue that also exists in setPRFalse
  const filteredSetPRTrue = setsToMarkAsPR
    .map(set => set.set_id)
    .filter(set_id => !setPRFalseIds.has(set_id));

  return {
    setPRTrue: filteredSetPRTrue,
    setPRFalse: setsToRemovePR.map(set => set.set_id),
  };
};


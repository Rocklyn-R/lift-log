

export const EXERCISE_ALIASES: Record<string, string> = {
  "rdl": "Romanian Deadlift",
  "rdls": "Romanian Deadlift",
  "paused rdls": "Romanian Deadlift (Paused)",
  "paused rdl": "Romanian Deadlift (Paused)",
  "hip thrust": "Barbell Hip Thrust",
  "squats": "Squat",
  "bench": "Flat Barbell Bench Press",
  "bench press": "Flat Barbell Bench Press",
  "incline bench": "Incline Barbell Bench Press"
};

export const groupLogsByDateAndCombineSets = (logs: any[]) => {
  const groupedByDate: Record<string, any> = {};

  for (const log of logs) {
    const dateKey = new Date(log.date).toDateString(); // Normalize for grouping
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = {
        exercise_name: log.exercise_name,
        date: log.date,
        exercise_order: log.exercise_order,
        exercise_id: log.exercise_id,
        sets: []
      };
    }

    groupedByDate[dateKey].sets.push({
      set_number: log.set_number,
      weight: parseFloat(log.weight),
      reps: log.reps,
      PR: log.PR,
      RPE: log.RPE ?? "-",
      RIR: log.RIR ?? "-",
      notes: log.notes ?? "-"
    });
  }

  // Convert object to array of sessions
  return Object.values(groupedByDate);
};

export const formatLogsForPromptByLift = (
  logsByLift: Record<string, any[]>,
  effortScale: "RPE" | "RIR"
): string => {
  const markdownChunks: string[] = [];

  for (const [liftName, sessions] of Object.entries(logsByLift)) {
    if (sessions.length === 0) {
      markdownChunks.push(`No logs found for **${liftName}** in the past 3 months.\n`);
      continue;
    }

    for (const session of sessions) {
      const dateHeader = `### ${new Date(session.date).toDateString()} - ${session.exercise_name}`;

      const tableHeader = `| Set | Weight | Reps | ${effortScale} | Notes | PR |\n|-----|--------|------|------|-------|----|`;

      const tableRows = session.sets
        .map((set: any) => {
          const weight = `${parseFloat(set.weight).toFixed(1).replace(/\.0$/, "")}kg`;
          const reps = `${set.reps}`;
          const effort = set[effortScale] ?? "-";
          const notes = set.notes ?? "-";
          const pr = set.PR === true ? "🏆" : "";

          return `| ${set.set_number} | ${weight} | ${reps} | ${effort} | ${notes} | ${pr} |`;
        })
        .join("\n");

      markdownChunks.push(`${dateHeader}\n\n${tableHeader}\n${tableRows}`);
    }
  }

  return markdownChunks.join("\n\n");
};


export const formatPRsForPrompt = (PRsByLift: Record<string, any[]>): string => {
  return Object.entries(PRsByLift)
    .map(([exercise, prs]) => {
      if (prs.length === 0) {
        return `### ${exercise}\n\n_No PRs found in the last 3 months._`;
      }

      const rows = prs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(pr => {
          const date = new Date(pr.date).toDateString().slice(4); // e.g. "Apr 11 2025"
          const weight = `${parseFloat(pr.weight_in_kg).toFixed(1).replace(/\.0$/, "")}kg`;
          const reps = pr.reps;
          const rpe = pr.RPE ?? "-";
          const notes = pr.notes ?? "-";
          return `| ${date} | ${weight} | ${reps} | ${rpe} | ${notes} |`;
        })
        .join("\n");

      return `### ${exercise}\n\n| Date | Weight | Reps | RPE | Notes |\n|------|--------|------|-----|-------|\n${rows}`;
    })
    .join("\n\n");
};

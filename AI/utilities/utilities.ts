

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
      weight_in_kg: parseFloat(log.weight_in_kg),
      weight_in_lbs: parseFloat(log.weight_in_lbs),
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
  effortScale: "RPE" | "RIR",
  unit_system: string
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
          const metric = unit_system === "Metric";
          const weight = metric ? `${parseFloat(set.weight_in_kg).toFixed(1).replace(/\.0$/, "")}kg` :  `${parseFloat(set.weight_in_lbs).toFixed(1).replace(/\.0$/, "")}lbs`;
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


export const formatPRsForPrompt = (
  PRsByLift: Record<string, any[]>,
  effort_scale: string,
  unit_system: string
): string => {
  return Object.entries(PRsByLift)
    .map(([exercise, prs]) => {
      if (prs.length === 0) {
        return `### ${exercise}\n\n_No PRs found in the last 3 months._`;
      }

      const rows = prs
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(pr => {
          const date = new Date(pr.date).toDateString().slice(4); // e.g. "Apr 11 2025"
          const metric = unit_system === "Metric";
          const effortValue = effort_scale === "RPE" ? pr.RPE : pr.RIR;
          const weight = metric ? `${parseFloat(pr.weight_in_kg).toFixed(1).replace(/\.0$/, "")}kg` : `${parseFloat(pr.weight_in_lbs).toFixed(1).replace(/\.0$/, "")}lbs`;
          const reps = pr.reps;
          const notes = pr.notes ?? "-";
          return `| ${date} | ${weight} | ${reps} | ${effortValue} | ${notes} |`;
        })
        .join("\n");

      return `### ${exercise}\n\n| Date | Weight | Reps | ${effort_scale} | Notes |\n|------|--------|------|-----|-------|\n${rows}`;
    })
    .join("\n\n");
};


export const formatGeneralLogsForPrompt = (
  logs: any[],
  effort_scale: "RPE" | "RIR",
  unit_system: "Metric" | "Imperial"
): string => {
  if (!logs.length) return "No recent logs found.";

  const metric = unit_system === "Metric";

  // Step 1: Group logs by category > exercise
  const grouped: Record<string, Record<string, any[]>> = {};
  for (const log of logs) {
    const category = log.category_name;
    const exercise = log.exercise_name;
    if (!grouped[category]) grouped[category] = {};
    if (!grouped[category][exercise]) grouped[category][exercise] = [];
    grouped[category][exercise].push(log);
  }

  // Step 2: Format each group
  const sections: string[] = [];

  for (const [category, exercises] of Object.entries(grouped)) {
    sections.push(`## ${category}\n`);

    for (const [exercise, entries] of Object.entries(exercises)) {
      const header = `### ${exercise}`;
      const tableHeader = `| Date | Weight | Reps | ${effort_scale} | Notes |`;
      const divider = `|------|--------|------|-----|-------|`;

      const rows = entries.map((log) => {
        const date = new Date(log.date).toDateString().slice(4); // "Apr 14 2025"
        const weight = metric
          ? `${parseFloat(log.weight_in_kg).toFixed(1).replace(/\.0$/, "")}kg`
          : `${parseFloat(log.weight_in_lbs).toFixed(1).replace(/\.0$/, "")}lbs`;
        const reps = log.reps;
        const effort = log[effort_scale] ?? "-";
        const notes = log.notes ?? "-";

        return `| ${date} | ${weight} | ${reps} | ${effort} | ${notes} |`;
      });

      sections.push([header, "", tableHeader, divider, ...rows, ""].join("\n"));
    }
  }

  return sections.join("\n");
};


export const formatGeneralPRsForPrompt = (
  logs: any[],
  effort_scale: "RPE" | "RIR",
  unit_system: "Metric" | "Imperial"
): string => {
  if (!logs.length) return "No PRs found in the past 2-3 months.";

  const metric = unit_system === "Metric";

  // Group logs by exercise name
  const grouped: Record<string, any[]> = {};
  for (const log of logs) {
    const exercise = log.exercise_name;
    if (!grouped[exercise]) grouped[exercise] = [];
    grouped[exercise].push(log);
  }

  const sections: string[] = [];

  for (const [exercise, sets] of Object.entries(grouped)) {
    const rows = sets.map((set) => {
      const date = new Date(set.date).toDateString().slice(4); // Format like "Apr 11 2025"
      const weight = metric
        ? `${parseFloat(set.weight_in_kg).toFixed(1).replace(/\.0$/, "")}kg`
        : `${parseFloat(set.weight_in_lbs).toFixed(1).replace(/\.0$/, "")}lbs`;
      const reps = set.reps;
      const effort = set[effort_scale] ?? "-";
      const notes = set.notes ?? "-";

      return `| ${date} | ${weight} | ${reps} | ${effort} | ${notes} |`;
    });

    const table = [
      `### ${exercise}`,
      "",
      `| Date | Weight | Reps | ${effort_scale} | Notes |`,
      `|------|--------|------|-----|-------|`,
      ...rows,
      ""
    ].join("\n");

    sections.push(table);
  }

  return sections.join("\n");
};

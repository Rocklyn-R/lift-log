import { Request, Response } from "express";
import openai from "../config/openAI";
import { getUserLogs } from "models/liftbotAI";
import fs from "fs";
import path from "path";

interface User {
  id: number
}

// Helper function
const needsWorkoutContext = async (message: string): Promise<boolean> => {
  const check = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
          You are a strict classifier.
          
          Your job is to determine whether a user's question requires access to their personal workout logs to be answered accurately and usefully.
          
          This includes:
          - questions about specific lifts (e.g., "Is my squat improving?")
          - questions asking about performance, history, progress, trends, or comparisons
          - any question that refers to "my lifts", "my progress", "have I improved", etc.
          
          If the question would benefit from looking at the user's past workout data, respond with "yes". Otherwise, respond with "no".
          
          ONLY reply with "yes" or "no". No explanations.
          `.trim(),
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const raw = check.choices[0].message?.content?.trim().toLowerCase();


  return raw === "yes";

};

export const formatLogsForPrompt = (logs: any[], effortScale: "RIR" | "RPE") => {
  const grouped: Record<string, any[]> = {};

  // Group logs by date + exercise
  logs.forEach((log) => {
    const date = new Date(log.date).toDateString();
    const key = `${date} - ${log.exercise_name}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(log);
  });

  // Generate markdown tables per group
  return Object.entries(grouped)
    .map(([header, sets]) => {
      const tableRows = sets
        .map((s) => {
          const weight = `${parseFloat(s.weight).toFixed(1).replace(/\.0$/, "")}kg`;
          const reps = `${s.reps} reps`;
          const rpeOrRir = effortScale === "RIR" ? s.RIR : s.RPE;
          const effort = rpeOrRir ?? "-";
          const notes = s.notes ?? "-";
          const pr = s.PR ? "🏆" : "";

          return `| ${s.set_number} | ${weight} | ${reps} | ${effort} | ${notes} | ${pr} |`;
        })
        .join("\n");

      return `### ${header}\n\n| Set | Weight | Reps | ${effortScale} | Notes | PR |\n|-----|--------|------|------|--------|----|\n${tableRows}`;
    })
    .join("\n\n");
};


export const getLiftBotReply = async (req: Request, res: Response) => {
  try {
    const { messages, needsContext, effort_scale } = req.body;
    const user_id = (req.user as User).id;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const latestUserMessage = messages
      .slice()
      .reverse()
      .find((m: any) => m.role === "user")?.content;
    if (!latestUserMessage) {
      res.status(400).json({ error: "No user message found in messages array." });
      return;
    }
    console.log(needsContext)
    const shouldUseContext = needsContext ? needsContext : await needsWorkoutContext(latestUserMessage);
    console.log(shouldUseContext);

    let systemPrompt = "You are LiftBot, a friendly strength training assistant.";

    if (shouldUseContext) {
      //console.log("Needs context");
      const recentLogs = await getUserLogs(user_id);
      const formattedLogs = formatLogsForPrompt(recentLogs, effort_scale);
      console.log(formattedLogs);
      const today = new Date();
      const formattedToday = today.toDateString(); // "Sun Apr 13 2025"

      // Load .md file and inject variables
      const promptTemplate = fs.readFileSync(
        path.join(__dirname, "../AIPrompts/LiftBot_Hypertrophy.md"),
        "utf-8"
      );

      systemPrompt = promptTemplate
        .replace(/{{TODAY}}/g, formattedToday)
        .replace(/{{EFFORT_SCALE}}/g, effort_scale)
        .replace(/{{FORMATTED_LOGS}}/g, formattedLogs);

    } else {
      systemPrompt = `
      You are LiftBot, a friendly strength training assistant.
      
      You are free to give helpful, evidence-based general advice about strength training, workouts, recovery, and progression. The user has NOT provided any workout data, so answer their question generally and helpfully without referencing any specific data.
      `.trim();
    }


    const cleanedMessages = messages.filter((msg: any) => msg.role !== "system");
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...cleanedMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: fullMessages,
    });

    const botReply = completion.choices[0]?.message?.content;
    res.status(200).json({ reply: botReply, needsContext: shouldUseContext });

  } catch (error) {
    console.error("LiftBot Error:", error);
    res.status(500).json({ error: "Something went wrong with LiftBot." });
  }
};
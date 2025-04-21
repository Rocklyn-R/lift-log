import { Request, Response } from "express";
import openai from "../config/openAI";
import { exerciseMatchFind, getPRData, getUserLogs } from "models/liftbotAI";
import fs from "fs";
import path from "path";
import { needsSpecificExercise, needsWorkoutContext } from "../AI/liftbot/classifiers/classifiers";
import { formatLogsForPromptByLift, formatPRsForPrompt, groupLogsByDateAndCombineSets } from "../AI/utilities/utilities";

interface User {
  id: number
}


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

    const shouldUseContext = needsContext ? needsContext : await needsWorkoutContext(latestUserMessage);

    let systemPrompt = "You are LiftBot, a friendly strength training assistant.";
    console.log(shouldUseContext);
    if (shouldUseContext) {
      const liftsToFind = await needsSpecificExercise(latestUserMessage)
      console.log(liftsToFind);
      if (liftsToFind.type !== "general") {
        const results = [];
        for (const lift of liftsToFind.lifts) {
          const matched = await exerciseMatchFind(lift, user_id);
          results[lift] = matched;
        }

        const allExerciseIds = Object.values(results).flat().map(exercise => exercise.id);
        const allLogs = await getUserLogs(user_id, allExerciseIds);
        const groupedLogs = groupLogsByDateAndCombineSets(allLogs);
        const PRData = await getPRData(user_id, allExerciseIds);
        //for (const [lift, matches] of Object.entries(results))
        const logsByLift: Record<string, any[]> = {};
        const PRsByLift: Record<string, any[]> = {};
        for (const [lift, matches] of Object.entries(results)) {
          const ids = matches.map(m => m.id);
          logsByLift[lift] = groupedLogs.filter(log => ids.includes(log.exercise_id));
          PRsByLift[lift] = PRData.filter(log => ids.includes(log.exercise_id))
        }
        console.log(PRsByLift);
        const formattedLogs = formatLogsForPromptByLift(logsByLift, effort_scale);

        const formattedPRs = formatPRsForPrompt(PRsByLift);
        const systemPromptTemplate = fs.readFileSync(
          path.join(__dirname, "../AI/liftbot/prompts/LiftBot_Hypertrophy.md"),
          "utf-8"
        );

        const today = new Date().toDateString(); // "Thu Apr 18 2025"

        systemPrompt = systemPromptTemplate
          .replace(/{{TODAY}}/g, today)
          .replace(/{{EFFORT_SCALE}}/g, effort_scale)
          .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
          .replace(/{{FORMATTED_PRS}}/g, formattedPRs);


      }

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
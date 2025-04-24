import { Request, Response } from "express";
import openai from "../config/openAI";
import { exerciseMatchFind, getGeneralLogs, getGeneralPRData, getPRData, getUserLogs } from "models/liftbotAI";
import fs from "fs";
import path from "path";
import { needsSpecificExercise, needsWorkoutContext } from "../AI/liftbot/classifiers/classifiers";
import { formatGeneralLogsForPrompt, formatGeneralPRsForPrompt, formatLogsForPromptByLift, formatPRsForPrompt, groupLogsByDateAndCombineSets } from "../AI/utilities/utilities";

interface User {
  id: number
}


export const getLiftBotReply = async (req: Request, res: Response) => {
  try {
    const {
      messages,
      needsContext,
      effort_scale,
      unit_system,
      training_goal,
      body_composition_goal,
      injuries
    } = req.body;
    const user_id = (req.user as User).id;
    console.log(body_composition_goal);
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Message is required." });
      return;
    }
    const today = new Date().toDateString(); // "Thu Apr 18 2025"
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
      console.log(liftsToFind.type);
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

        const formattedLogs = formatLogsForPromptByLift(logsByLift, effort_scale, unit_system);

        const formattedPRs = formatPRsForPrompt(PRsByLift, effort_scale, unit_system);
        if (body_composition_goal === "Lose Fat") {
          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/fat_loss/Specific_FatLoss.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{LIFT_NAMES}}/g, liftsToFind.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs);

        } else if (body_composition_goal === "Maintain / Recomp") {
          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/recomp/Specific_Recomp.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{LIFT_NAMES}}/g, liftsToFind.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs);

        } else {
          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/gain_muscle/Specific_GainMuscle.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{BODY_COMPOSITION_GOAL}}/, body_composition_goal)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{LIFT_NAMES}}/g, liftsToFind.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs);
        }
      } else {
        const generalLogs = await getGeneralLogs(user_id);
        const generalPRData = await getGeneralPRData(user_id);
        const formattedGeneralLogs = formatGeneralLogsForPrompt(generalLogs, effort_scale, unit_system);
        const formattedGeneralPRs = formatGeneralPRsForPrompt(generalPRData, effort_scale, unit_system);

        if (body_composition_goal === "Lose Fat") {

          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/fat_loss/General_FatLoss.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{BODY_COMPOSITION_GOAL}}/, body_composition_goal)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{FORMATTED_LOGS}}/g, formattedGeneralLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs);
        } else if (body_composition_goal === "Maintain / Recomp") {

          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/recomp/General_Recomp.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{BODY_COMPOSITION_GOAL}}/, body_composition_goal)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{FORMATTED_LOGS}}/g, formattedGeneralLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs);
        } else {
          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/gain_muscle/General_GainMuscle.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{BODY_COMPOSITION_GOAL}}/, body_composition_goal)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{FORMATTED_LOGS}}/g, formattedGeneralLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs);
        }
      }

    } else {
      if (body_composition_goal === "Lose Fat") {
        const systemPromptTemplate = fs.readFileSync(
          path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/fat_loss/NoContext_FatLoss.md"),
          "utf-8"
        );

        systemPrompt = systemPromptTemplate
          .replace(/{{TODAY}}/g, today)
          .replace(/{{EFFORT_SCALE}}/g, effort_scale)
          .replace(/{{UNIT_SYSTEM}}/g, unit_system)
          .replace(/{{INJURIES}}/g, injuries)

      } else if (body_composition_goal === "Maintain / Recomp") {
        const systemPromptTemplate = fs.readFileSync(
          path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/recomp/NoContext_Recomp.md"),
          "utf-8"
        );

        systemPrompt = systemPromptTemplate
          .replace(/{{TODAY}}/g, today)
          .replace(/{{EFFORT_SCALE}}/g, effort_scale)
          .replace(/{{UNIT_SYSTEM}}/g, unit_system)
          .replace(/{{INJURIES}}/g, injuries)

      } else {
        const systemPromptTemplate = fs.readFileSync(
          path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/gain_muscle/NoContext_Hypertrophy.md"),
          "utf-8"
        );

        systemPrompt = systemPromptTemplate
          .replace(/{{TODAY}}/g, today)
          .replace(/{{EFFORT_SCALE}}/g, effort_scale)
          .replace(/{{UNIT_SYSTEM}}/g, unit_system)
      }

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
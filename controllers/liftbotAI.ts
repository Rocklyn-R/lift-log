import { Request, Response } from "express";
import openai from "../config/openAI";
import { exerciseMatchFind, getGeneralLogs, getGeneralPRData, getPRData, getUserLogs } from "../models/liftbotAI";
import fs from "fs";
import path from "path";
import { detectFocusShift, needsSpecificExercise, needsWorkoutContext } from "../AI/liftbot/classifiers/classifiers";
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
      body_composition_goal,
      injuries,
      currentFocus,
      focusShiftMessage
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
console.log("CURRENTFOCUS:", currentFocus);
console.log("FocusShiftMessage", focusShiftMessage)
    const shouldUseContext = needsContext ? needsContext : await needsWorkoutContext(latestUserMessage);

    let systemPrompt = "You are LiftBot, a friendly strength training assistant.";
    const hypertrophyTemplate = fs.readFileSync(
      path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/hypertrophy.md"),
      "utf-8"
    ).trim();
    const injuriesTemplate = fs.readFileSync(
      path.join(__dirname, "../AI/liftbot/prompts/injuries/injuries.md"),
      "utf-8"
    ).trim();

    const injuriesGuide = injuriesTemplate
      .replace(/{{INJURIES}}/g, injuries);

    const hypertrophyGuide = hypertrophyTemplate
      .replace(/{{INJURIES}}/g, injuries ? injuriesGuide : "User has no injuries.")

    let newFocusShiftMessage;
    let newConversationFocus;
 
    if (shouldUseContext) {
      if (!focusShiftMessage) {

        newConversationFocus = await needsSpecificExercise(latestUserMessage);
        newFocusShiftMessage = latestUserMessage;
      } else {
        const focusShift = await detectFocusShift(focusShiftMessage, currentFocus, latestUserMessage)
        console.log(focusShift);
        if (focusShift === "shifted") {
          newConversationFocus = await needsSpecificExercise(latestUserMessage);
          newFocusShiftMessage = latestUserMessage;
        } else {
          newConversationFocus = currentFocus;
          newFocusShiftMessage = focusShiftMessage
        }
      }

      if (newConversationFocus.type !== "general") {
        const results = [];
        for (const lift of newConversationFocus.lifts) {
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
            .replace(/{{LIFT_NAMES}}/g, newConversationFocus.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);

        } else if (body_composition_goal === "Maintain / Recomp") {
          const systemPromptTemplate = fs.readFileSync(
            path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/recomp/Specific_Recomp.md"),
            "utf-8"
          );

          systemPrompt = systemPromptTemplate
            .replace(/{{TODAY}}/g, today)
            .replace(/{{EFFORT_SCALE}}/g, effort_scale)
            .replace(/{{UNIT_SYSTEM}}/g, unit_system)
            .replace(/{{LIFT_NAMES}}/g, newConversationFocus.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);

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
            .replace(/{{LIFT_NAMES}}/g, newConversationFocus.lifts.map((name: string) => `- ${name}`).join('\n'))
            .replace(/{{FORMATTED_LOGS}}/g, formattedLogs)
            .replace(/{{FORMATTED_PRS}}/g, formattedPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);
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
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);
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
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);
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
            .replace(/{{FORMATTED_PRS}}/g, formattedGeneralPRs)
            .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide)
        }
      }

    } else {
      newConversationFocus = { type: 'no-context', lifts: [] }
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
          .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);

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
          .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);

      } else {
        const systemPromptTemplate = fs.readFileSync(
          path.join(__dirname, "../AI/liftbot/prompts/hypertrophy/gain_muscle/NoContext_GainMuscle.md"),
          "utf-8"
        );

        systemPrompt = systemPromptTemplate
          .replace(/{{TODAY}}/g, today)
          .replace(/{{EFFORT_SCALE}}/g, effort_scale)
          .replace(/{{UNIT_SYSTEM}}/g, unit_system)
          .replace(/{{HYPERTROPHY_GUIDE}}/g, hypertrophyGuide);
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
    console.log("New Focus Shift Message:", newFocusShiftMessage);
    console.log("New Conversation Focus:", newConversationFocus);
    const botReply = completion.choices[0]?.message?.content;
    res.status(200).json({
      reply: botReply,
      needsContext: shouldUseContext,
      focusShiftMessage: newFocusShiftMessage,
      conversationFocus: newConversationFocus
    });

  } catch (error) {
    console.error("LiftBot Error:", error);
    res.status(500).json({ error: "Something went wrong with LiftBot." });
  }
};
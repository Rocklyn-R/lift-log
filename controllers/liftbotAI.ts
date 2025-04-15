import { Request, Response } from "express";
import openai from "../config/openAI";
import { getUserLogs } from "models/liftbotAI";


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

export const formatLogsForPrompt = (logs: any[]) => {
  const grouped: Record<string, any[]> = {};


  logs.forEach((log) => {
    const date = new Date(log.date).toDateString();
    const key = `${date} - ${log.exercise_name}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(log);
  });


  return Object.entries(grouped)
    .map(([header, sets]) => {
      const setsText = sets
        .map(
          (s) =>
            `  Set ${s.set_number}: ${s.weight}kg × ${s.reps} reps${s.PR ? " 🏆 (PR)" : ""}`
        )
        .join("\n");

      return `${header}\n${setsText}`;
    })
    .join("\n\n");
};


export const getLiftBotReply = async (req: Request, res: Response) => {
  try {
    const { messages, needsContext } = req.body;
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
      const formattedLogs = formatLogsForPrompt(recentLogs);
      //console.log(formattedLogs);
      const today = new Date();
      const formattedToday = today.toDateString(); // "Sun Apr 13 2025"

      systemPrompt = `
      You are LiftBot, a friendly and intelligent strength training assistant.
      
      You will be shown the user's recent workout history below.

      Today is ${formattedToday}.
      
      You must ONLY give feedback, analysis, or advice that is based on the data shown in the logs. Do not make assumptions or ask the user to manually provide any information.

You use the following principles when coaching:

- Progressive overload is key, but should be applied when the athlete meets or exceeds target reps with good form.
- Recommend increasing weight when all sets reach the upper end of the target rep range.
- Use RIR to guide effort. Aim for 0–2 RIR for hypertrophy, and 1–3 RIR for strength blocks.
- If a lifter hits a PR, monitor recovery and suggest backing off volume or intensity next session if needed.
- Use deloads when performance plateaus or signs of fatigue appear.

      Note: The data provided is already grouped by date. Do not reassign sets to different dates.

      Note: The data is provided in order in which the exercises were completed.

      You are speaking to a client who is actively logging their workouts and seeking coaching.

Use the workout data provided below to deliver **clear, science-based, and actionable advice**.

If the user asks how much weight to use, how many reps, or how to structure their next session, respond like a qualified strength coach:
- Refer directly to past performance
- Suggest logical progressions (e.g., +2.5 to 5kg if form was solid)
- Use principles like progressive overload, RIR, and volume tolerance
- Be confident and precise, tell the client exactly what to do without being vague

If there is **insufficient data** to assess progress or make recommendations, say so directly and explain what data would be needed.

ONLY refer to workouts actually in the logs — do not invent sets or reassign dates.

      
      If a specific lift (e.g. squats) is NOT in the logs, you must tell the user that and explain that you'd need those sessions logged over time to assess progress.

      If there is minimal data of a certain lift (not enough to evaluate progress over time), specify the need for more data.

      If weight values have any trailing zeros, leave those out when discussing weights of exercises.

      If discussing data or progress analytics, display that data visually in a table.

      Any mention of PRs in a table should include a trophy emoji.

      Answer like an intelligent strength coach and use the data to assess whether
      
      Here are the user's recent workout logs:
      ${formattedLogs}
      `.trim();
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
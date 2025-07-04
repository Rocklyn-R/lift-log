import openai from "../../../config/openAI";
import fs from "fs";
import path from "path";


// Helper function
export const needsWorkoutContext = async (message: string): Promise<boolean> => {
    const contextPromptPath = path.join(__dirname, "./classifierPrompts/needsWorkoutContext.md");
    const contextPrompt = fs.readFileSync(contextPromptPath, "utf-8").trim();

    const check = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: contextPrompt,
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

export const needsSpecificExercise = async (userMessage: string) => {
    const systemPromptPath = path.join(__dirname, "./classifierPrompts/needsSpecificExercise.md");
    const systemPrompt = fs.readFileSync(systemPromptPath, "utf-8").trim();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
        });
        const rawContent = completion.choices[0]?.message?.content;
        if (!rawContent) return { type: "general", lifts: [] };
        const cleaned = rawContent
            .trim()
            .replace(/^```(?:json)?/, '')
            .replace(/```$/, '');

        const parsed = JSON.parse(cleaned);


        return parsed;

    } catch (err) {
        console.error("Classifier error:", err);
        return { type: "general", lifts: [] };
    }
};

interface ConversationFocus {
    type: string;
    lifts: string[]
}
export const detectFocusShift = async (prevMessage: string, focus: ConversationFocus, newMessage: string): Promise<"shifted" | "same"> => {
    const systemPromptPath = path.join(__dirname, "./classifierPrompts/detectFocusShift.md");
    
    const systemPrompt = fs.readFileSync(systemPromptPath, "utf8").trim();

    const userPrompt = `
  Previous message: "${prevMessage}"
  Current focus: ${focus.type === "general" ? "general" : focus.lifts.join(", ")}
  New message: "${newMessage}"
    `.trim();

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]
    });

    const result = completion.choices[0]?.message?.content?.trim().toLowerCase();
    return result === "shifted" ? "shifted" : "same";
};

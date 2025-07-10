import { GoogleGenAI } from "@google/genai";
import {
  aiIntegrationContextSchema,
  questionRefinementContextSchema,
  questionGenerationContextSchema,
  translationContextSchema,
  chartExplanationContextSchema,
  // questionEnhancementContextSchema,
  // chartTranslationContextSchema,
  // For generating or enhancing multiple questions
  // Assuming you might have a dedicated schema for translated metadata/charts if they differ from input
} from "./prompt.schemas.js"; // Adjust this import path as needed
import { promptTemplates } from "./prompts.js"; // Adjust this import path as needed
import { z, ZodError } from "zod"; // Import ZodError for specific error handling
import {
  questionSchema,
  questionsSchema,
} from "../../schema/question.schemas.js";

// Initialize your AI client (assuming 'ai' is already initialized elsewhere or passed in)
// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY!);

// Define a union type for all possible output schemas from the AI
// This helps TypeScript understand the return type based on the operation
type AIOutputSchema<T extends (typeof aiIntegrationContextSchema)["_output"]> =
  T extends (typeof questionRefinementContextSchema)["_output"]
    ? typeof questionSchema
    : T extends (typeof questionGenerationContextSchema)["_output"]
    ? typeof questionsSchema
    : T extends (typeof translationContextSchema)["_output"]
    ? any // Adjust 'any' to a specific translation output schema if you have one
    : T extends (typeof chartExplanationContextSchema)["_output"]
    ? any // Adjust 'any' to a specific chart translation output schema if you have one
    : never; // Fallback for unhandled types

/**
 * Handles AI content generation with robust error handling and schema validation.
 * @param aiClient The initialized GoogleGenAI client.
 * @param context The input context adhering to aiIntegrationContextSchema.
 * @returns The validated AI-generated data.
 * @throws {Error} If the AI call fails or the response is invalid.
 */

const aiClient = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY,
});
export async function processAIRequest<
  T extends (typeof aiIntegrationContextSchema)["_output"]
>(context: T): Promise<z.infer<AIOutputSchema<T>>> {
  // Determine the prompt template and expected output schema based on the operation
  let prompt: string;
  let outputSchema: any; // Using 'any' here for flexibility, but ideally, you'd match it
  // precisely based on the 'operation' in a more complex conditional type or map.

  switch (context.operation) {
    case "refine":
      prompt = promptTemplates.refineQuestion(context);
      outputSchema = questionSchema; // Expects a single question object
      break;
    case "generate":
      prompt = promptTemplates.generateQuestions(context);
      outputSchema = questionsSchema; // Expects an array of question objects
      break;
    case "translate":
      prompt = promptTemplates.translateContent(context);
      // For translation, the output structure is often the same as the input
      // This might require a dynamic schema or 'z.any()' if the input can vary widely.
      // For now, using 'z.any()' but strongly recommend a dedicated schema for translated outputs.
      outputSchema = z.any(); // You might want a more specific schema here
      break;
    // case "enhance":
    //   prompt = promptTemplates.generateQuestions(context); // Assuming enhance also returns an array of questions
    //   outputSchema = questionsSchema;
    //   break;
    case "explain_chart_data":
      prompt = promptTemplates.explainChartData(context);
      // Similar to translate, output schema might mirror input or be 'z.any()'
      outputSchema = z.any(); // You might want a more specific schema here
      break;
    default:
      // This should ideally not be reached if aiIntegrationContextSchema is correctly discriminated
      throw new Error(
        `Unsupported AI operation: ${(context as any).operation}`
      );
  }

  // --- AI Model Interaction ---
  let rawJsonResponse: string;
  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      // Always specify responseMimeType for structured JSON output
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Check if candidates exist and contain content
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error("AI response was empty or lacked candidates.");
    }
    const candidate = response.candidates[0];

    // Access the text part. It should be directly the JSON string due to responseMimeType.
    rawJsonResponse = candidate.content?.parts?.[0]?.text ?? "";

    if (!rawJsonResponse) {
      throw new Error("AI response did not contain expected text content.");
    }
  } catch (error: any) {
    console.error("Error during AI content generation:", error);

    // Provide more specific error messages based on common AI issues
    if (error.status === 429 || error.code === 429) {
      throw new Error(
        "AI service rate limit exceeded. Please try again shortly."
      );
    }
    if (error.status === 500 || error.code === 500) {
      throw new Error(
        "AI service internal error. The model might be overloaded or encountered an issue."
      );
    }
    if (error.status === 503 || error.code === 503) {
      throw new Error(
        "AI service temporarily unavailable. Please retry after some time."
      );
    }
    if (error.status === 400 || error.code === 400) {
      // This could be due to a malformed prompt or input context too large
      throw new Error(
        `AI service rejected request: ${
          error.message || "Invalid input."
        }. Ensure context size is within limits.`
      );
    }

    // Rethrow a generic error if not handled specifically
    throw new Error(
      `Failed to generate AI content: ${error.message || "Unknown error"}`
    );
  }

  // --- JSON Parsing and Schema Validation ---
  let parsedOutput: any;
  try {
    parsedOutput = JSON.parse(rawJsonResponse);
  } catch (parseError) {
    console.error("Failed to parse AI-generated JSON:", parseError);
    console.error("Raw AI Response:", rawJsonResponse); // Log raw for debugging
    throw new Error("AI generated malformed JSON. Could not parse response.");
  }

  try {
    // Validate the parsed object against the appropriate Zod schema
    const validatedOutput = outputSchema.parse(parsedOutput);
    return validatedOutput;
  } catch (validationError) {
    if (validationError instanceof ZodError) {
      console.error(
        "AI-generated JSON failed schema validation:",
        validationError.errors
      );
      console.error("Raw AI Response:", rawJsonResponse); // Log raw for debugging
      throw new Error(
        `AI generated JSON that did not conform to the expected schema. Details: ${JSON.stringify(
          validationError.errors
        )}`
      );
    } else {
      console.error(
        "An unexpected error occurred during schema validation:",
        validationError
      );
      throw new Error(
        "An unexpected validation error occurred with AI output."
      );
    }
  }
}

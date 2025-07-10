// This schema definition is a shared resource for prompt generation.

import type {
  QuestionGenerationContext,
  QuestionRefinementContext,
  TranslationContext,
} from "./prompt.schemas.js";

// It ensures the AI always has the exact structure to follow for question-related tasks.
export const QUESTION_SCHEMA_DEFINITION = `
JSON SCHEMA (You MUST follow this structure for each question object):
{
  "questionText": "string",
  "required": boolean,
  "orderNumber": number,
  "id": "string",
  "questionType": "text" | "email" | "number" | "phone" | "multiple_choice" | "checkbox" | "dropdown"  | "likert" | "linear_scale" | "date" | "time" | "datetime" | "file" | "slider",
  "options": {
    // NOTE: The 'options' object should contain ONLY THE PROPERTIES OF ONE KEY,
    // corresponding to the 'questionType'.
    "text": { "placeholder": "string", "isMultiline": boolean, "minAnswerLength": number, "maxAnswerLength": number },
    "email": { "placeholder": "string", "minEmailLength": number, "maxEmailLength": number, "allowedDomains": "string", "disallowedDomains": "string", "allowDuplicates": boolean },
    "number": { "placeholder": "string", "allowDecimal": boolean, "min": number, "max": number },
    "phone": { "allowedCountries": ["string"], "format": "string" },
    "multiple_choice": { "choices": ["string"], "maxLengthForOtherParameter": number, "allowOther": boolean, "randomizeOrder": boolean },
    "checkbox": { "choices": ["string"], "minSelections": number, "maxSelections": number, "randomizeOrder": boolean },
    "dropdown": { "choices": ["string"], "allowSearch": boolean },
    "likert": { "scale": number, "labels": ["string"] },
    "linear_scale": { "min": number, "max": number, "labels": { "start": "string", "end": "string" } },
    "date": { "format": "ISO e.g 2023-04-05" | "MM/DD/YYYY (US Format) e.g 04/15/2023" | "DD/MM/YYYY (UK/European Format)  e.g 15/04/2023" | "Month name, day and year e.g April 15, 2023", "minDate": "string", "maxDate": "string" },
    "time": { "format": "24-hour with seconds e.g 14:30:45" | "24-hour without seconds e.g 14:30" | "12-hour with AM/PM e.g 2:30 PM" | "12-hour with seconds e.g 2:30:45 PM", "minTime": "string", "maxTime": "string" },
    "datetime": { "format": "ISO e.g 2023-04-15T14:30:45" | "Date and 12-hour time e.g Apr 15, 2023 2:30 PM" | "Date and 24-hour time e.g 15/04/2023 14:30" | "Full date and time e.g April 15, 2023 14:30:45", "minDatetime": "string", "maxDatetime": "string" },
    "file": { "allowMultiple": boolean, "acceptedFormats": ["string"], "maxSizeMB": number, "maxFiles": number },
    "slider": { "min": number, "max": number, "step": number, "labels": { "start": "string", "end": "string" }, "range": boolean, "defaultValue": "number | [number, number]" }
  }
}
`;

export const promptTemplates = {
  // 1. Question Refinement
  refineQuestion: (context: QuestionRefinementContext) => `
You are a survey design expert specializing in data-driven question refinement.

TASK: Refine the provided survey question based on specific goals and contextual feedback.

INPUTS:
- Survey Purpose: ${context.surveyPurpose || "Not provided"}
- Target Audience: ${context.targetAudience || "Not provided"}
- Tone: ${context.tone || "professional"}
- Question to Refine (Current State): ${JSON.stringify(
    context.questionToRefine,
    null,
    2
  )}
- Refinement Goals: ${context.refinementGoals?.join(", ") || "clarity"}
- Common Issues Reported: ${context.commonIssues || "None"}
- Existing Questions (for additional context, top 5 if available): ${
    context.existingQuestions
      ? JSON.stringify(context.existingQuestions.slice(0, 5), null, 2)
      : "None"
  }

RULES FOR REFINEMENT:
1. Your refinement MUST address the specified 'Refinement Goals'.
2. The 'id', 'orderNumber', and 'questionType' fields MUST remain unchanged from the 'Question to Refine' input. **Specifically, preserve the CUID2 'id' exactly as provided.**
3. Only modify the 'questionText' and the content of the 'options' object to meet the refinement goals.

FINAL OUTPUT FORMAT:
You MUST return ONLY a single, valid JSON object. Do NOT include any markdown (like \`\`\`json), explanations, or additional text outside of the JSON object itself. The JSON object MUST strictly adhere to the following schema definition for a question object.

${QUESTION_SCHEMA_DEFINITION}

EXAMPLE OF EXPECTED JSON OUTPUT STRUCTURE (using a simple 'text' question type as an illustration):
{
  "questionText": "What is your main feedback about the new feature?",
  "required": true,
  "orderNumber": 1,
  "id": "some_cuid2_id",
  "questionType": "text",
  "options": {
    "placeholder": "Enter your feedback here...",
    "isMultiline": true,
    "minAnswerLength": 10,
    "maxAnswerLength": 500
  }
}

Return the refined question as a single JSON object now.
`,

  // 2. Question Generation
generateQuestions: (context: QuestionGenerationContext) => `
You are an expert survey designer who generates high-quality, targeted questions.

CRITICAL: You MUST return ONLY a valid JSON array. No markdown, no explanations, no text outside the JSON.

TASK: Generate exactly ${context.numberOfQuestions} survey questions based on the requirements below.

INPUTS:
- Survey Purpose: ${context.surveyPurpose || "Not provided"}
- Target Audience: ${context.targetAudience || "Not provided"}
- Industry: ${context.industry || "General"}
- Tone: ${context.tone || "professional"}
- Survey Title: ${context.surveyTitle ?? ""}
- Survey Description: ${context.surveyDescription ?? ""}
- Additional Context Providing Topics: ${context.topics?.join(", ") || "General"}
- Custom Prompt: ${context.customPrompt || "None"}
- Topics to AVOID: ${context.avoidTopics?.join(", ") || "None"}
- Number of Questions: ${context.numberOfQuestions}
- Include Demographics: ${context.includeDemographics || false}
- Requested Question Types: ${context.requestedQuestionTypes?.join(", ") || "Any"}
- Existing Questions Count: ${context.existingQuestions?.length || 0}

MANDATORY RULES:
1. Return ONLY a valid JSON array of question objects
2. Generate exactly ${context.numberOfQuestions} questions
3. Start orderNumber from ${(context.existingQuestions?.length || 0) + 1}

5. Follow the EXACT schema structure below
6. Avoid all topics listed in 'Topics to AVOID'

SCHEMA STRUCTURE:
Each question object must have exactly these 5 fields:
- id: string 
- surveyId: null (always null for new questions)
- questionText: string (the actual question)
- questionType: one of the 14 allowed types below
- options: object with properties specific to the questionType (can be undefined)
- required: boolean (true/false)
- orderNumber: number (sequential, starting from ${(context.existingQuestions?.length || 0) + 1})
- createdAt: string (ISO datetime string)

ALLOWED QUESTION TYPES (exactly 14 types):
"text" | "email" | "number" | "multiple_choice" | "checkbox" | "dropdown" | "likert" | "linear_scale" | "date" | "time" | "datetime" | "file" | "slider"

EXACT OPTIONS SCHEMA FOR EACH TYPE:

1. "text":
   options: { "placeholder": "string (optional)", "isMultiline": boolean, "minAnswerLength": number, "maxAnswerLength": number }

2. "email":
   options: { "placeholder": "string (optional)", "minEmailLength": number, "maxEmailLength": number, "allowedDomains": "string (optional)", "disallowedDomains": "string (optional)", "allowDuplicates": boolean }

3. "number":
   options: { "placeholder": "string (optional)", "allowDecimal": boolean, "min": number, "max": number }

4. "multiple_choice":
   options: { "choices": ["string"], "maxLengthForOtherParameter": number, "allowOther": boolean, "randomizeOrder": boolean }

5. "checkbox":
   options: { "choices": ["string"], "minSelections": number, "maxSelections": number, "randomizeOrder": boolean }

6. "dropdown":
   options: { "choices": ["string"], "allowSearch": boolean }

7. "likert":
   options: { "scale": number, "labels": ["string"] }

8. "linear_scale":
   options: { "min": number, "max": number, "labels": { "start": "string", "end": "string" } }

9. "date":
   options: { "format": "ISO e.g 2023-04-05" | "MM/DD/YYYY (US Format) e.g 04/15/2023" | "DD/MM/YYYY (UK/European Format)  e.g 15/04/2023" | "Month name, day and year e.g April 15, 2023", "minDate": "string", "maxDate": "string" }

10. "time":
    options: { "format": "24-hour with seconds e.g 14:30:45" | "24-hour without seconds e.g 14:30" | "12-hour with AM/PM e.g 2:30 PM" | "12-hour with seconds e.g 2:30:45 PM", "minTime": "string", "maxTime": "string" }

11. "datetime":
    options: { "format": "ISO e.g 2023-04-15T14:30:45" | "Date and 12-hour time e.g Apr 15, 2023 2:30 PM" | "Date and 24-hour time e.g 15/04/2023 14:30" | "Full date and time e.g April 15, 2023 14:30:45", "minDatetime": "string", "maxDatetime": "string" }

12. "file":
    options: { "allowMultiple": boolean, "acceptedFormats": ["string"], "maxSizeMB": number, "maxFiles": number }

13. "slider":
    options: { "min": number, "max": number, "step": number, "labels": { "start": "string", "end": "string" }, "range": boolean, "defaultValue": number | [number, number] (optional) }

IMPORTANT NOTES:
- "phone" is NOT a valid question type (it's not in your TypeScript schema)
- "rating" is NOT a valid question type (it's not in your TypeScript schema)
- Some options fields are optional (marked with ? in TypeScript)
- surveyId must always be null for new questions
- createdAt must be a valid ISO datetime string

EXAMPLE CORRECT OUTPUT:
[
  {
    "id": "ckm1234567890abcdef",
    "surveyId": null,
    "questionText": "What is your age?",
    "questionType": "number",
    "options": {
      "placeholder": "Enter your age",
      "allowDecimal": false,
      "min": 18,
      "max": 120
    },
    "required": true,
    "orderNumber": 1,
    "createdAt": "2025-07-08T12:00:00.000Z"
  },
  {
    "id": "ckm0987654321fedcba",
    "surveyId": null,
    "questionText": "How satisfied are you with our service?",
    "questionType": "likert",
    "options": {
      "scale": 5,
      "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]
    },
    "required": true,
    "orderNumber": 2,
    "createdAt": "2025-07-08T12:00:00.000Z"
  }
]

VALIDATION CHECKLIST:
Before returning your response, verify:
□ Output is valid JSON array only
□ Exactly ${context.numberOfQuestions} questions generated
□ Each question has all 7 required fields: id, surveyId, questionText, questionType, options, required, orderNumber, createdAt
□ Each 'surveyId' is null
□ Each 'questionType' matches exactly one of the 14 allowed types (no phone, no rating)
□ Each 'options' object contains only properties for its questionType
□ Each 'createdAt' is a valid ISO datetime string
□ OrderNumber starts from ${(context.existingQuestions?.length || 0) + 1} and increments

Return the JSON array now:
`,

  // 3. Content Translation
  translateContent: (context: TranslationContext) => `
You are an expert translator specializing in survey and content localization.

TASK: Translate user-facing text to the target language, applying localization best practices.

INPUTS:
- Source Language: ${context.sourceLanguage}
- Target Language: ${context.targetLanguage}
- Questions to Translate: ${
    context.questionsToTranslate
      ? JSON.stringify(context.questionsToTranslate, null, 2)
      : "None"
  }

RULES:
1. You MUST return a single, valid JSON object with the exact same structure as the input. Do NOT use markdown or add explanations.
2. Translate ONLY user-facing text strings (e.g., title, description, questionText, and text within options like choices, labels, placeholders).
3. Do NOT translate JSON keys, IDs, types, boolean values, or numeric values.
4. If 'culturalAdaptation' is true (${
    context.culturalAdaptation
  }), adapt phrasing, idioms, and examples to be culturally appropriate for the target region.

  }), change examples (like cities, names, currency) to match the target region.
6. If 'preserveTechnicalTerms' is true (${
    context.preserveTechnicalTerms
  }), do NOT translate known technical terms.

Return the translated content in the exact same JSON structure.

EXAMPLE OF EXPECTED JSON OUTPUT STRUCTURE (using a simple 'text' question type as an illustration):
{
  "questionText": "What is your main feedback about the new feature?",
  "required": true,
  "orderNumber": 1,
  "id": "some_cuid2_id",
  "questionType": "text",
  "options": {
    "placeholder": "Enter your feedback here...",
    "isMultiline": true,
    "minAnswerLength": 10,
    "maxAnswerLength": 500
  }
}
`,

  // 4. Chart Data Explanation (formerly translateCharts)
  explainChartData: (context: any) => `
You are an expert data analyst and communicator, highly skilled at interpreting raw data from survey responses and explaining its meaning in a clear, concise, and insightful way. Your goal is to provide a comprehensive narrative about the data presented in the context of its original question, automatically determining the best way to present the information.

TASK: Analyze the provided 'chartData' (which represents aggregated survey responses) in relation to the original survey 'questionText' and 'questionType'. Generate a detailed explanation of the data's details, key insights, underlying trends, and what the data signifies. The explanation must be in the specified target language.

INPUTS:
- Original Survey Question Text: ${context.questionText}
- Original Survey Question Type: ${context.questionType}
- Original Survey Question Options (if applicable): ${
    context.options ? JSON.stringify(context.options, null, 2) : "None"
  }
- Aggregated Chart Data (Answer Counts): ${JSON.stringify(
    context.chartData,
    null,
    2
  )}

Always explain in english, regardless of the 'targetLanguage' specified in the context.
also, make it as detailed as possible, covering all aspects of the data. You're the expert here, so provide a thorough analysis.
1. You MUST return ONLY a single, valid JSON object with a single property named 'explanation'. Do NOT include any markdown (like \`\`\`json), explanations, or additional text outside of the JSON object itself.
2. The entire 'explanation' string MUST be written in the 'Target Language for Explanation'.
3. **Automatically infer the most appropriate audience, tone, and focus areas** (e.g., main trends, outliers, implications) based on the 'questionText', 'questionType', and the nature of the 'chartData'. You do not need explicit 'audience', 'tone', or 'focusAspects' inputs.
4. Start by briefly describing what the data represents, linking it directly to the 'questionText' (e.g., "The data for '${
    context.questionText
  }' shows...").
5. Highlight the most important data points, significant trends (increases, decreases, plateaus), and notable patterns or anomalies within the 'chartData'.
6. Interpret what the data *means* in its probable context. Provide insights into the implications or conclusions that can be drawn from the responses.
7. Use the 'questionType' (e.g., "multiple_choice", "likert", "rating") to inform how you interpret the 'answer' values in \`chartData\` and how you structure your explanation. For example, for Likert scales, discuss agreement levels; for multiple choice, discuss distribution across options.
8. Do NOT include any code, translate any JSON keys, or attempt to replicate the input data structure in your output. Your output is *only* the textual explanation within the JSON object.
9. Keep the explanation concise yet comprehensive, suitable for a summary or commentary section.

FINAL OUTPUT FORMAT:
You MUST follow this exact structure for your response:
{
  "explanation": "string" // This string will contain the full explanation in the target language.
}

Return the chart explanation in valid JSON format now.
`,
};

/**
 * Builds the final prompt string to be sent to the AI.
 * @param operation The specific AI task to perform (e.g., 'refine', 'generate').
 * @param context The validated context object matching the Zod schema for that operation.
 * @returns The complete prompt string for the AI.
 */
export const buildPrompt = (operation: string, context: any): string => {
  const basePrompt = (() => {
    switch (operation) {
      case "refine":
        return promptTemplates.refineQuestion(context);
      case "generate":
        return promptTemplates.generateQuestions(context);
      case "translate":
        return promptTemplates.translateContent(context);
      case "translate_charts":
        return promptTemplates.explainChartData(context);
      default:
        throw new Error(`Unknown or unimplemented AI operation: ${operation}`);
    }
  })();

  // Dynamically append the detailed JSON schema for operations that need to produce question objects.
  const needsSchema = ["refine", "generate", "translate"].includes(operation);
  return needsSchema
    ? `${basePrompt}\n\n${QUESTION_SCHEMA_DEFINITION}`
    : basePrompt;
};

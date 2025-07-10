import { z } from "zod";
import {
  questionSchema,
  questionsSchema,
} from "../../schema/question.schemas.js";

const baseAIContextSchema = z.object({
  surveyTitle: z.string().optional(),
  surveyDescription: z.string().optional(),
  surveyPurpose: z
    .enum([
      "market_research",
      "customer_feedback",
      "employee_satisfaction",
      "academic_research",
      "event_feedback",
      "product_evaluation",
      "demographic_study",
      "other",
    ])
    .optional(),
  targetAudience: z.string().optional(), // e.g., "college students", "healthcare workers"
  industry: z.string().optional(),

  tone: z
    .enum(["formal", "casual", "friendly", "professional", "academic"])
    .default("professional"),
  complexity: z.enum(["simple", "moderate", "complex"]).default("moderate"),
  existingQuestions: z.any(), // Your questionSchema array
});

export const questionRefinementContextSchema = baseAIContextSchema.extend({
  operation: z.literal("refine"),
  questionToRefine: questionSchema, // Your questionSchema
  refinementGoals: z
    .array(
      z.enum([
        "clarity",
        "reduce_bias",
        "improve_wording",
        "fix_grammar",
        "make_more_specific",
        "make_more_general",
        "improve_accessibility",
        "reduce_length",
        "add_examples",
      ])
    )
    .default(["clarity"]),
  commonIssues: z.string().optional(), 
});


export const questionGenerationContextSchema = baseAIContextSchema.extend({
  operation: z.literal("generate"),

  requestedQuestionTypes: z
    .array(
      z.enum([
        "text",
        "email",
        "number",
        "multiple_choice",
        "checkbox",
        "dropdown",
        "likert",
        "linear_scale",
        "date",
        "time",
        "datetime",
        "file",
        "slider",
      ])
    )
    .optional(),
  numberOfQuestions: z.number().int().min(1).max(50).default(5),
  topics: z.array(z.string()).optional(), // e.g., ["demographics", "product satisfaction", "usage patterns"]

  includeRequired: z.boolean().default(true),
  includeDemographics: z.boolean().default(false),
  includeOpenEnded: z.boolean().default(true),

  customPrompt: z.string().optional(), // e.g., "Focus on mobile app usability"
  avoidTopics: z.array(z.string()).optional(), // Sensitive topics to avoid
});

// 3. Translation Context
export const translationContextSchema = baseAIContextSchema.extend({
  operation: z.literal("translate"),

  // Translation parameters
  sourceLanguage: z.string().default("english"),
  targetLanguage: z.string(),

  // What to translate
  questionsToTranslate: questionsSchema, // Your questionSchema array
  preserveFormatting: z.boolean().default(true),
  culturalAdaptation: z.boolean().default(true), // Adapt for cultural context
  preserveTechnicalTerms: z.boolean().default(false),
});

const genericOptionsSchema = z.object({}).passthrough().optional();

export const chartExplanationContextSchema = baseAIContextSchema.extend({
  operation: z.literal("explain_chart_data"),

  chartData: z.array(
    z.object({
      answer: z.union([z.number(), z.string()]),
      count: z.number(),
    })
  ),

  questionType: z.string(),
  questionText: z.string().min(1),
  options: genericOptionsSchema,

  targetLanguage: z.string(),
});

// Master AI Context Schema
export const aiIntegrationContextSchema = z.discriminatedUnion("operation", [
  questionRefinementContextSchema,
  chartExplanationContextSchema,
  questionGenerationContextSchema,
  translationContextSchema,
]);

// Additional utility schemas
export const aiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(), // The refined/generated questions or translated content
  suggestions: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
});

// For batch operations
export const batchAIContextSchema = z.object({
  operations: z.array(aiIntegrationContextSchema),
  preserveOrder: z.boolean().default(true),
  stopOnError: z.boolean().default(false),
});

// User preference schema for AI operations
export const aiUserPreferencesSchema = z.object({
  defaultTone: z
    .enum(["formal", "casual", "friendly", "professional", "academic"])
    .default("professional"),
  preferredLanguages: z.array(z.string()).default(["en"]),
  industry: z.string().optional(),
  accessibilityRequirements: z.array(z.string()).optional(),
  avoidedTopics: z.array(z.string()).optional(),
  customInstructions: z.string().optional(),
});

// Example usage types
export type AIIntegrationContext = z.infer<typeof aiIntegrationContextSchema>;
export type QuestionRefinementContext = z.infer<
  typeof questionRefinementContextSchema
>;
export type QuestionGenerationContext = z.infer<
  typeof questionGenerationContextSchema
>;
export type TranslationContext = z.infer<typeof translationContextSchema>;

export type ChartExplanationContext = z.infer<
  typeof chartExplanationContextSchema
>;
export type AIResponse = z.infer<typeof aiResponseSchema>;
export type AIUserPreferences = z.infer<typeof aiUserPreferencesSchema>;

export const v = {
  questionRefinementContextSchema,
  questionGenerationContextSchema,
  translationContextSchema,
  chartExplanationContextSchema,
  aiIntegrationContextSchema,
  aiResponseSchema,
  batchAIContextSchema,
  aiUserPreferencesSchema,
};

const a = {
    "topic": "string", // The main subject or area the survey will cover (e.g., "Customer Satisfaction with New Product", "Employee Engagement", "Public Opinion on Climate Change")
    "goal": "string", // The specific objective you want to achieve with this survey (e.g., "Identify areas for product improvement", "Measure employee morale", "Understand public support for a new policy")
    "description": "string", // A more detailed explanation of the survey's context and what kind of information you're hoping to gather.
    "targetAudience": "string", // A description of the group of people you want to participate in the survey (e.g., "Customers who purchased our new software in the last month", "All employees of the company", "Adult residents of Lagos State")
    "demographics": { // Optional: Specific demographic criteria for the target audience
      "ageRange": "string", // (e.g., "18-35", "25+")
      "gender": ["male", "female", "other"],
      "location": "string", // (e.g., "United States", "Specific city or region")
      "educationLevel": ["High School", "Bachelor's", "Master's", "PhD"],
      "incomeRange": "string", // (e.g., "$30,000 - $50,000", "Above $75,000")
      "other": "string" // Field for any other relevant demographic information
    },
    "surveyLengthPreference": "short" | "medium" | "long", // Desired length of the survey to influence the number of questions
    "responseFormatPreference": ["multiple_choice", "open_ended", "rating_scale"], // Preferred types of questions (can be a mix)
    "keyMetrics": ["satisfaction", "engagement", "awareness"], // Specific aspects you want to measure
    "desiredOutcomes": "string", // What you hope to achieve with the survey results (e.g., "Actionable insights for product development", "Data to support policy changes", "Understanding of employee needs")
    "language": "string" // The primary language for the survey (e.g., "en", "fr", "es", "yo" for Yoruba as you're in Ibadan)
  }

  const b = {
    "surveyId": "string", // Unique identifier of the survey containing the question
    "questionId": "string", // Unique identifier of the question to be adjusted
    "adjustmentType": "refine" | "expand" | "simplify" | "change_type" | "add_options" | "remove_options" | "modify_options",
    "parameters": {
      // Parameters specific to the adjustmentType
      "newQuestionText"?: "string", // For 'refine', 'expand', 'simplify', 'change_type'
      "newQuestionType"?: "QuestionType", // For 'change_type'
      "explanationForChange"?: "string", // Guidance for the AI on the desired nuance or focus
      "targetAudience"?: "string", // To tailor the language to a specific group (can override survey-level)
      "addTheseOptions"?: string[], // For 'add_options' (for multiple_choice, checkbox, dropdown)
      "removeTheseOptionIndices"?: number[], // For 'remove_options' (indices of options to remove)
      "modifyTheseOptions"?: { // For 'modify_options' (key is index, value is the new option text)
        "0"?: "string",
        "1"?: "string",
        // ...
      },
      "optionsToModify"?: Partial<QuestionOptionsMap[QuestionType]>, // For modifying existing options (e.g., changing placeholder, min/max values)
      "newRequiredStatus"?: "boolean" // To change whether the question is mandatory
    }
  }

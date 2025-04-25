import { z } from 'zod'

const baseQuestionSchema = z.object({
  questionText: z.string().min(1),
  required: z.boolean().default(true),
  orderNumber: z.number().int().nonnegative(),
  id: z.string()
})

export const questionSchema = z.discriminatedUnion('questionType', [
  z.object({
    questionType: z.literal('text'),
    options: z.object({
      placeholder: z.string().optional(),
      isMultiline: z.boolean().default(false),
      minAnswerLength: z.number().int().min(0).default(1),
      maxAnswerLength: z.number().int().min(1).default(255),
    }).default({
      placeholder: '',
      isMultiline: false,
      minAnswerLength: 1,
      maxAnswerLength: 255,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('email'),
    options: z.object({
      placeholder: z.string().optional(),
      minEmailLength: z.number().int().min(0).default(1),
      maxEmailLength: z.number().int().min(1).default(255),
      allowedDomains: z.string().optional().default(''),
      disallowedDomains: z.string().optional().default(''),
      allowDuplicates: z.boolean().default(false),
    }).default({
      placeholder: '',
      minEmailLength: 1,
      maxEmailLength: 255,
      allowedDomains: '',
      disallowedDomains: '',
      allowDuplicates: false,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('number'),
    options: z.object({
      placeholder: z.string().optional(),
      allowDecimal: z.boolean().default(false),
      min: z.number().default(Number.NEGATIVE_INFINITY),
      max: z.number().default(Number.POSITIVE_INFINITY),
    }).default({
      placeholder: '',
      allowDecimal: false,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('phone'),
    options: z.object({
      allowedCountries: z.array(z.string()).default([]),
      format: z.string().default(''),
    }).default({
      allowedCountries: [],
      format: '',
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('multiple_choice'),
    options: z.object({
      choices: z.array(z.string()).min(0).default([]),
      maxLengthForOtherParameter: z.number().default(255),
      allowOther: z.boolean().default(false),
      randomizeOrder: z.boolean().default(false),
    }).default({
      choices: [],
      maxLengthForOtherParameter: 255,
      allowOther: false,
      randomizeOrder: false,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('checkbox'),
    options: z.object({
      choices: z.array(z.string()).min(0).default([]),
      minSelections: z.number().int().default(1),
      maxSelections: z.number().int().default(5),
      randomizeOrder: z.boolean().default(false),
    }).default({
      choices: [],
      minSelections: 1,
      maxSelections: 5,
      randomizeOrder: false,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('dropdown'),
    options: z.object({
      choices: z.array(z.string()).min(0).default([]),
      allowSearch: z.boolean().default(false),
    }).default({
      choices: [],
      allowSearch: false,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('rating'),
    options: z.object({
      min: z.number().default(1),
      max: z.number().default(5),
      labels: z.array(z.string()).default([]),
    }).default({
      min: 1,
      max: 5,
      labels: [],
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('likert'),
    options: z.object({
      scale: z.number().int().default(5),
      labels: z.array(z.string()).default([
        'Strongly Disagree',
        'Disagree',
        'Neither Agree nor Disagree (or Neutral)',
        'Agree',
        'Strongly Agree',
      ]),
    }).default({
      scale: 5,
      labels: [
        'Strongly Disagree',
        'Disagree',
        'Neither Agree nor Disagree (or Neutral)',
        'Agree',
        'Strongly Agree',
      ],
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('linear_scale'),
    options: z.object({
      min: z.number().default(1),
      max: z.number().default(3),
      labels: z.object({
        start: z.string().default(''),
        end: z.string().default(''),
      }).default({
        start: '',
        end: '',
      }),
    }).default({
      min: 1,
      max: 3,
      labels: {
        start: '',
        end: '',
      },
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('date'),
    options: z.object({
      format: z.enum([
        'ISO e.g 2023-04-05',
        'MM/DD/YYYY (US Format) e.g 04/15/2023',
        'DD/MM/YYYY (UK/European Format)  e.g 15/04/2023',
        'Month name, day and year e.g April 15, 2023',
      ]).default('ISO e.g 2023-04-05'),
      minDate: z.string().default(''),
      maxDate: z.string().default(''),
    }).default({
      format: 'ISO e.g 2023-04-05',
      minDate: '',
      maxDate: '',
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('time'),
    options: z.object({
      format: z.enum([
        '24-hour with seconds e.g 14:30:45',
        '24-hour without seconds e.g 14:30',
        '12-hour with AM/PM e.g 2:30 PM',
        '12-hour with seconds e.g 2:30:45 PM',
      ]).default('12-hour with AM/PM e.g 2:30 PM'),
      minTime: z.string().default(''),
      maxTime: z.string().default(''),
    }).default({
      format: '12-hour with AM/PM e.g 2:30 PM',
      minTime: '',
      maxTime: '',
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('datetime'),
    options: z.object({
      format: z.enum([
        'ISO e.g 2023-04-15T14:30:45',
        'Date and 12-hour time e.g Apr 15, 2023 2:30 PM',
        'Date and 24-hour time e.g 15/04/2023 14:30',
        'Full date and time e.g April 15, 2023 14:30:45',
      ]).default('Date and 12-hour time e.g Apr 15, 2023 2:30 PM'),
      minDatetime: z.string().default(''),
      maxDatetime: z.string().default(''),
    }).default({
      format: 'Date and 12-hour time e.g Apr 15, 2023 2:30 PM',
      minDatetime: '',
      maxDatetime: '',
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('file'),
    options: z.object({
      allowMultiple: z.boolean().default(false),
      acceptedFormats: z.array(z.string()).default([]),
      maxSizeMB: z.number().default(1),
      maxFiles: z.number().default(1),
    }).default({
      allowMultiple: false,
      acceptedFormats: [],
      maxSizeMB: 1,
      maxFiles: 1,
    }),
  }).merge(baseQuestionSchema),

  z.object({
    questionType: z.literal('slider'),
    options: z.object({
      min: z.number().default(0),
      max: z.number().default(100),
      step: z.number().default(1),
      labels: z.object({
        start: z.string().default(''),
        end: z.string().default(''),
      }).default({
        start: '',
        end: '',
      }),
      range: z.boolean().default(false),
      defaultValue: z.union([z.number(), z.tuple([z.number(), z.number()])]).optional().default(0),
    }).default({
      min: 0,
      max: 100,
      step: 1,
      labels: {
        start: '',
        end: '',
      },
      range: false,
      defaultValue: 0,
    }),
  }).merge(baseQuestionSchema),
])

export const questionsSchema = z.array(questionSchema)

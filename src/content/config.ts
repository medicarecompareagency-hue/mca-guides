import { defineCollection, z } from 'astro:content';

// Every field without .optional() is REQUIRED. If it's missing, the build
// fails. That's deliberate - a missing meta description is an SEO hole and
// a missing disclaimer is a compliance problem, and neither should be able
// to reach production quietly.
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(65,
      'Title over 65 chars gets truncated in Google results'),
    description: z.string().min(70).max(165,
      'Meta description should be roughly 70-165 chars'),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    targetKeyword: z.string(),
    author: z.string().default('Medicare Compare Agency'),
    reviewedForCompliance: z.boolean(),
    complianceReviewedBy: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };

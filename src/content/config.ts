import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    image: z.string().optional(),
  }),
});

export const collections = { blog };

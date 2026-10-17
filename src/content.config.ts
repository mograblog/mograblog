import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/posts' }),
  schema: z.object({
    title: z.string().default('Untitled'),
    published: z.union([z.string(), z.date()]).transform((val) => {
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date() : d;
    }).optional().default(() => new Date()),
    description: z.string().optional().default(''),
    keywords: z.string().optional().default(''),
    cover: z.string().optional(),
    coverTitle: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { posts };

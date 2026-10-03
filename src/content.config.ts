import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects/.
// The filename (without .md) becomes the URL slug: /work/<filename>.
// Media paths are relative to /public, e.g. "/projects/my-project/poster.jpg".
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Display order and the "01 /" label on cards. */
    number: z.number().int().positive(),
    category: z.enum(['3D animation', 'Lighting & compositing', 'Game development']),
    year: z.number().int(),
    tools: z.array(z.string()).default([]),
    /** Still image: shown before the preview loads and when the viewer prefers reduced motion. */
    poster: z.string(),
    posterAlt: z.string(),
    /** Looping preview for cards. Provide webm and/or mp4 (preferred), or a gif. All optional. */
    preview: z
      .object({
        webm: z.string().optional(),
        mp4: z.string().optional(),
        gif: z.string().optional(),
      })
      .nullish()
      .transform((v) => v ?? {}), // An empty `preview:` key (all lines commented out) is fine.
    /** Frame rate of the preview clip; the project page scrubber steps one frame per arrow key. */
    previewFps: z.number().positive().default(24),
    /** "contain" letterboxes the clip instead of cropping it (e.g. vertical or non-16:9 footage). */
    previewFit: z.enum(['cover', 'contain']).default('cover'),
    /** Color of the letterbox bars when previewFit is "contain". Match the clip's background. */
    previewBackdrop: z.string().default('#000'),
    /** YouTube or Vimeo link (watch, share or embed URL all work). */
    fullVideoUrl: z.url().optional(),
    /** Featured project gets the full-width card. */
    featured: z.boolean().default(false),
    /** Only list awards you actually won. */
    awards: z
      .array(z.object({ title: z.string(), event: z.string() }))
      .optional(),
    breakdownImages: z
      .array(z.object({ src: z.string(), alt: z.string(), caption: z.string() }))
      .optional(),
    itchUrl: z.url().optional(),
  }),
});

export const collections = { projects };

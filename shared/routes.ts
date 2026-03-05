import { z } from 'zod';
import { insertLoveNoteSchema, loveNotes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  notes: {
    create: {
      method: 'POST' as const,
      path: '/api/notes' as const,
      input: insertLoveNoteSchema,
      responses: {
        201: z.custom<typeof loveNotes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/notes/:token' as const,
      responses: {
        200: z.custom<typeof loveNotes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  drive: {
    getRandomImage: {
      method: 'POST' as const,
      path: '/api/drive/random-image' as const,
      input: z.object({ folderLink: z.string().url() }),
      responses: {
        200: z.object({ imageUrl: z.string() }),
        400: errorSchemas.validation,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

import { z } from "zod";

// Default pagination values
export const initialMetaDefault = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

// Schema for pagination metadata
export const metaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type meta = z.infer<typeof metaSchema>;

// Schema for pagination metadata
export const paginationDataSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: metaSchema,
  });

import * as z from "zod";

/////////////////////////////
// Zod schema for API responses
/////////////////////////////
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    statusCode: z.number(),
    message: z.union([z.string(), z.string().array()]),
    data: dataSchema.nullable(),
    type: z.string(),
  });

// TypeScript type for API responses
export type apiResponse<T = unknown> = {
  statusCode?: number;
  message?: string | string[];
  data?: T | null;
  type?:
    | "success"
    | "error"
    | "warning"
    | "completed"
    | "isLoading"
    | "default";
};

// Default values for API responses
export const apiResponseDefault = <T = unknown>(): apiResponse<T> => ({
  statusCode: 200,
  message: "",
  data: null,
  type: "default",
});

/////////////////////////////
// Initial Form State Types
// Used with Zod and useActionState
/////////////////////////////

export type InitialState<Errors, Result> = {
  errors?: Errors | null;
  result?: Result | null;
  message?: string | string[];
  type?:
    | "success"
    | "error"
    | "warning"
    | "completed"
    | "isLoading"
    | "default";
};

// Default initial values for form state
export const initialStateDefault = <
  Errors = unknown,
  Result = unknown
>(): InitialState<Errors, Result> => ({
  errors: undefined,
  result: undefined,
  message: undefined,
  type: "default",
});

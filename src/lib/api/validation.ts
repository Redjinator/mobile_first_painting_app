import { z, ZodSchema } from 'zod';
import { ValidationError } from './errors';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const cuidSchema = z.string().cuid('Invalid ID format');

export const phoneSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number').optional();

export const dateSchema = z.union([z.string(), z.date()]).transform((val) => {
  if (typeof val === 'string') {
    return new Date(val);
  }
  return val;
});

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Validate request body helper
export function validateRequestBody<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.issues);
    }
    throw error;
  }
}

// Validate query parameters helper
export function validateQueryParams<T>(schema: ZodSchema<T>, params: unknown): T {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.issues);
    }
    throw error;
  }
}

// Validate partial update (all fields optional)
export function validatePartial<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): Partial<z.infer<typeof schema>> {
  const partialSchema = schema.partial();
  return validateRequestBody(partialSchema, data) as any;
}

// Generic validate function (alias for validateRequestBody)
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  return validateRequestBody(schema, data);
}

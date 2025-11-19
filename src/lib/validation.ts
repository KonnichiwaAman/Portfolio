import { z } from 'zod';

/**
 * Common validation schemas and utilities
 * Centralized location for form validation logic
 */

export const emailSchema = z.string().email('Please enter a valid email address');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long');

export const messageSchema = z
  .string()
  .min(10, 'Message must be at least 10 characters')
  .max(1000, 'Message is too long');

export const subjectSchema = z
  .string()
  .min(5, 'Subject must be at least 5 characters')
  .max(100, 'Subject is too long');

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: subjectSchema,
  message: messageSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Validates form data and returns errors in a more usable format
 */
export const validateFormData = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { isValid: boolean; errors: Record<string, string>; data?: z.infer<T> } => {
  try {
    const validated = schema.parse(data);
    return { isValid: true, errors: {}, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

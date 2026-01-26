import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Signup validation schema
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Send money validation schema
export const sendMoneySchema = z.object({
  recipient: z
    .string()
    .min(1, 'Recipient is required')
    .min(2, 'Recipient name must be at least 2 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    })
    .refine((val) => parseFloat(val) <= 1000000, {
      message: 'Amount cannot exceed $1,000,000',
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(100, 'Description must be less than 100 characters'),
});

// Add expense/transaction validation schema
export const addExpenseSchema = z.object({
  type: z
    .enum(['send', 'receive', 'bills', 'savings'], {
      errorMap: () => ({ message: 'Please select a transaction type' }),
    }),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number',
    })
    .refine((val) => parseFloat(val) <= 1000000, {
      message: 'Amount cannot exceed $1,000,000',
    }),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description must be less than 200 characters'),
  category: z
    .string()
    .min(1, 'Category is required'),
  recipient: z
    .string()
    .max(100, 'Recipient/source name must be less than 100 characters')
    .optional(),
  date: z
    .string()
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: 'Date cannot be in the future',
    }),
});

// Budget validation schema
export const budgetSchema = z.object({
  category: z
    .string()
    .min(1, 'Category is required'),
  amount: z
    .string()
    .min(1, 'Budget amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Budget must be a positive number',
    }),
  period: z
    .enum(['daily', 'weekly', 'monthly', 'yearly'], {
      errorMap: () => ({ message: 'Please select a budget period' }),
    }),
  alertThreshold: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100), {
      message: 'Alert threshold must be between 0 and 100',
    }),
});

// Savings goal validation schema
export const savingsGoalSchema = z.object({
  goalName: z
    .string()
    .min(1, 'Goal name is required')
    .min(3, 'Goal name must be at least 3 characters')
    .max(50, 'Goal name must be less than 50 characters'),
  targetAmount: z
    .string()
    .min(1, 'Target amount is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Target amount must be a positive number',
    }),
  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .refine((val) => new Date(val) > new Date(), {
      message: 'Deadline must be in the future',
    }),
  initialAmount: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'Initial amount must be a positive number or zero',
    }),
});

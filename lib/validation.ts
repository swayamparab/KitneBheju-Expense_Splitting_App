import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3),

  email: z
    .email(),

  password: z
    .string()
    .min(6),
});

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(50),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().min(1),
});

export const createExpenseSchema = z.object({
    title: z.string().min(1).max(100),

    amount: z.number().positive(),

    participantIds: z
        .array(z.string())
        .min(1),
});

export const updateExpenseSchema = z.object({
    title: z.string().min(1).max(100),

    amount: z.number().positive(),
});
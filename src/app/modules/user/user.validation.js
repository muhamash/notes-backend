import { z } from "zod";
import { USER_ACTION, USER_ROLES } from "../../utils/enums/users.enum.js";


export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),

  role: z
    .enum(USER_ROLES)
    .optional(),

  interests: z
    .array(z.string().min(1))
    .optional(),

  userAction: z
    .enum(USER_ACTION)
    .optional()
});



export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required"),
});



export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .optional(),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  password: z
    .string()
    .min(6)
    .optional(),

  role: z
    .enum(USER_ROLES)
    .optional(),

  interests: z
    .array(z.string().min(1))
    .optional(),

  userAction: z
    .enum(USER_ACTION)
    .optional()
} );

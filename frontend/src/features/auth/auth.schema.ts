import * as z from "zod";

export const registerSchema = z.object({
  email: z.string().email("Неверный формат почты"),
  username: z.string().min(3, "Минимум 3 символа"),
  password: z.string().min(6, "Пароль от 6 символов"),
  firstName: z.string().min(2, "Введите имя"),
  lastName: z.string().min(2, "Введите фамилию"),
});

export const loginSchema = z.object({
  email: z.string().email("Неверный формат почты"),
  password: z.string().min(6, "Пароль от 6 символов"),
});

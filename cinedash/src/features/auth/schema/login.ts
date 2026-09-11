import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido").min(1, "O e-mail é obrigatório"),
  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(7, "A senha deve ter mais de 6 caracteres")
});

export type LoginInput = z.infer<typeof loginSchema>;

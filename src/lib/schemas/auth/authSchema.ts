import z from "zod"

export const UserRowSchema = z.object({
  id:         z.string().uuid(),
  first_name: z.string().max(50),
  last_name:  z.string().max(50),
  role:       z.object({ name: z.string() }),
  email:      z.string().email().nullable(),
  password:   z.string(),
  created_at: z.string().transform(s => new Date(s)),
})
export  type UserRow = z.infer<typeof UserRowSchema>
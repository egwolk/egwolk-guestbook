import { z } from "zod";

export const messageSchema = z.object({
    id: z.number().int().positive().min(1),
    message: z.string().min(1).max(100),
})

// type Message = z.infer<typeof messageSchema>

export const createMessageSchema = messageSchema.omit({ id: true })
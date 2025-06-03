import { z } from "zod";
import {insertMessagesSchema} from "./db/schema/messages";

export const createMessageSchema = insertMessagesSchema.omit({ 
    id: true, 
    userId: true,
    createdAt: true
})
// z.object({
//     id: z.number().int().positive().min(1),
//     message: z.string().min(1).max(100),
// })

// type Message = z.infer<typeof messageSchema>

// export const createMessageSchema = messageSchema.omit({ id: true })
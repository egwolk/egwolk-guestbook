import { z } from "zod";
import { insertMessagesSchema } from "./db/schema/messages";

export const createMessageSchema = insertMessagesSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type CreateMessage = z.infer<typeof createMessageSchema>;
import { z } from "zod/v4";
import { insertMessagesSchema, updateMessagesSchema, selectMessageSchema } from "./db/schema/messages";

export const createMessageSchema = insertMessagesSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  modifiedAt: true,
});
export const editMessageSchema = updateMessagesSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  modifiedAt: true,
});

export type CreateMessage = z.infer<typeof createMessageSchema>;
export type EditMessage = z.infer<typeof editMessageSchema>;
export type SelectMessage = z.infer<typeof selectMessageSchema>;
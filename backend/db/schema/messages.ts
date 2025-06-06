import { text, pgTable, serial, index, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from "zod/v4";
export const messages = pgTable(
    'messages', 
    {
        id: serial('id').primaryKey(),
        userId: text('user_id').notNull(),
        message: text('message').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    }, 
    (messages) => [
        index('name_idx').on(messages.userId),
    ]
)

export const insertMessagesSchema = createInsertSchema(messages, {
    message: z
    .string()
    .min(1)
});
export const selectMessagesSchema = createSelectSchema(messages);

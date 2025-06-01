import { text, pgTable, serial, index, timestamp } from "drizzle-orm/pg-core";


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

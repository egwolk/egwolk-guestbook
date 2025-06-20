import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';

import { getUser } from "../kinde";

import { db } from "../db"
import { messages as messagesTable, insertMessagesSchema, updateMessagesSchema } from "../db/schema/messages"
import { eq, desc, count, and } from "drizzle-orm"

import { createMessageSchema } from "../sharedTypes";

// const testMessages: Message[] = [
//     { id: 1, message: "Hello, world!" },
//     { id: 2, message: "Hono is great!" },
//     { id: 3, message: "TypeScript is awesome!" },
// ]


export const messagesRoute = new Hono()
.get("/", getUser, async (c) => {
    const user = c.var.user
    const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.userId, user.id))
        .orderBy(desc(messagesTable.createdAt))
        .limit(100)
    return c.json({messages: messages})
})
.post("/",getUser, zValidator("json", createMessageSchema), async (c) => {
    const message = await c.req.valid("json")
    const user = c.var.user

    const validatedMessage = insertMessagesSchema.parse({
        ...message,
        userId: user.id
    })

    const result = await db
        .insert(messagesTable)
        .values(validatedMessage)
        .returning()
        .then((res) => res[0])

    // const message = createPostSchema.parse(data)
    console.log(message)
    // testMessages.push({...message, id: testMessages.length + 1}) 
    c.status(201)
    return c.json(result)
})
.get("/total-messages", getUser, async (c) => { // for testing
    // await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate a delay
    // const total = testMessages.length
    // return c.json({total})

    const user = c.var.user
    const totalResult = await db
        .select({ total: count() })
        .from(messagesTable)
        .where(eq(messagesTable.userId, user.id))
        .limit(1)
        .then(res => res[0])

    return c.json(totalResult);
})
.get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user

    const message = await db
        .select()
        .from(messagesTable)
        .where(and(eq(messagesTable.userId, user.id), eq(messagesTable.id, id)))
        .then(res => res[0])

    // const message = testMessages.find(message => message.id === id)

    if (!message) {
        return c.notFound()
    }
    return c.json({message}) 
})
.delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    // const index = testMessages.findIndex(message => message.id === id)
    const user = c.var.user

    const message = await db
        .delete(messagesTable)
        .where(and(eq(messagesTable.userId, user.id), eq(messagesTable.id, id)))
        .returning()
        .then(res => res[0])


    // if (index === -1) {
    //     return c.notFound()
    // }
    if (!message) {
        return c.notFound()
    }
    // const deletedMessage = testMessages.splice(index, 1)[0]
    return c.json({message: message}) 
})
.put("/:id{[0-9]+}", getUser, zValidator("json", updateMessagesSchema), async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user
    const message = await c.req.valid("json")

    const validatedMessage = updateMessagesSchema.parse({
        ...message,
        userId: user.id
    })

    const updated = await db
        .update(messagesTable)
        .set(validatedMessage)
        .where(and(eq(messagesTable.userId, user.id), eq(messagesTable.id, id)))
        .returning()
        .then(res => res[0])

    if (!updated) {
        return c.notFound()
    }
    return c.json(updated)
})
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const messageSchema = z.object({
    id: z.number().int().positive().min(1),
    msg: z.string().min(1).max(2000).trim().nonempty("Message cannot be empty"),
})

type Message = z.infer<typeof messageSchema>

const createMessageSchema = messageSchema.omit({ id: true })

const testMessages: Message[] = [
    { id: 1, msg: "Hello, world!" },
    { id: 2, msg: "This is a test message." },
    { id: 3, msg: "Another test message." }
]

export const messagesRoute = new Hono()
.get("/", (c) => {
    return c.json({messages: testMessages})
})
.post("/", zValidator("json", createMessageSchema), async (c) => {
    const message = await c.req.valid("json")
    console.log({message})
    testMessages.push({...message, id: testMessages.length + 1})
    c.status(201)
    return c.json(message)
})
.get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const message = testMessages.find(message => message.id === id)
    if (!message) {
        return c.notFound()

    }
    return c.json({message})
})
.delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const messageIndex = testMessages.findIndex(message => message.id === id)
    if (messageIndex === -1) {
        return c.notFound()
    }
    const deletedMessage = testMessages.splice(messageIndex, 1)[0]
    return c.json({message: deletedMessage})
})
// .put


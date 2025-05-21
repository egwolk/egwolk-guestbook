import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';

type Message = {
    id: number;
    message: string;
}

const testMessages: Message[] = [
    { id: 1, message: "Hello, world!" },
    { id: 2, message: "Hono is great!" },
    { id: 3, message: "TypeScript is awesome!" },
]

const createMessageSchema = z.object({
    message: z.string().min(1).max(100),
})

export const messagesRoute = new Hono()
.get("/", (c) => {
    return c.json({messages: testMessages})
})
.post("/", zValidator("json", createMessageSchema), async (c) => {
    const data = await c.req.valid("json")
    const message = createMessageSchema.parse(data)
    console.log(message)
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
    const index = testMessages.findIndex(message => message.id === id)
    if (index === -1) {
        return c.notFound()
    }
    const deletedMessage = testMessages.splice(index, 1)[0]
    return c.json({message: deletedMessage}) 
})
// .put
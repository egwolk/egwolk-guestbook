import { Hono } from "hono";
import { z } from "zod";

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
.post("/", async (c) => {
    const data = await c.req.json()
    const message = createMessageSchema.parse(data)
    console.log(message)
    return c.json(message)
})
// .delete
// .put
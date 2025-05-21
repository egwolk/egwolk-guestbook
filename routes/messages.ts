import { Hono } from "hono";

type Message = {
    id: number;
    message: string;
}

const testMessages: Message[] = [
    { id: 1, message: "Hello, world!" },
    { id: 2, message: "Hono is great!" },
    { id: 3, message: "TypeScript is awesome!" },
]

export const messagesRoute = new Hono()
.get("/", (c) => {
    return c.json({messages: testMessages})
})
.post("/", async (c) => {
    const data = await c.req.json()
    console.log(data)
    return c.json(data)
})
// .delete
// .put
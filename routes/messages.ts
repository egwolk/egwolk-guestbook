import { Hono } from "hono";

type Message = {
    id: number;
    text: string;
}

const testMessages = [
    { id: 1, text: "Hello, world!" },
    { id: 2, text: "Hono is great!" },
    { id: 3, text: "TypeScript is awesome!" },
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
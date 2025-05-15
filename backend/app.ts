import { Hono } from "hono";
import { logger } from "hono/logger";
import { messagesRoute } from "./routes/messages.ts";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
    return c.json({ message: "Hello, world!" });
});

app.route("/api/messages", messagesRoute);

export default app;
import app from "./app.ts";

Deno.serve(app.fetch,)

console.log("Server is running on http://localhost:8000");
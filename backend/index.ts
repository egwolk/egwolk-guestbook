import app from './app.ts'

const server = Bun.serve({
    fetch: app.fetch,
    port: process.env.PORT || 3000,
    hostname: "0.0.0.0"
})
console.log("Server is running", server.port)
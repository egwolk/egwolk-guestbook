import { Hono } from 'hono'
import { logger } from 'hono/logger'

const app = new Hono()

app.use('*', logger())

app.get('/test', (c) => {
    return c.json({ message: 'Hello, Hono!'})
})

export default app
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { messagesRoute } from './routes/messages'   

const app = new Hono()

app.use('*', logger())

app.get('/test', (c) => {
    return c.json({ message: 'Hello, Hono!'})
})

app.route('/api/messages', messagesRoute)

export default app
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { messagesRoute } from './routes/messages'; 
import { serveStatic } from 'hono/bun';
import { authRoute } from './routes/auth';

const app = new Hono();

app.use('*', logger());

app.get('/test', (c) => {
    return c.json({ message: 'Hello, Hono!'})
});
// app.get('/', (c) => {
//     return c.text('connected')
// })
const apiRoutes = app.basePath('/api').route('/messages', messagesRoute).route('/', authRoute);

// for deployment
app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
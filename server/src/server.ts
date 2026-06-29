import cors from 'cors'
import express from 'express'
import { config } from 'dotenv'

import { dbConnect } from './db/db-connect.js'
import { authRoutes, tasksRoutes } from './routes/index.js'

config()

const app = express()
const port = Number(process.env.PORT ?? 5000)

// Configure CORS explicitly so the browser can call the API from the frontend origin.
// Uses CORS_ORIGIN from server/.env (fallback to localhost dev).
// Comma-separate multiple origins, e.g. "http://localhost:5173,https://example.com"
const corsOriginRaw = process.env.CORS_ORIGIN ?? '*'
const corsOrigin = corsOriginRaw === '*' ? '*' : corsOriginRaw.split(',').map((s) => s.trim())
// If you set CORS_ORIGIN in .env, it must exactly match the frontend origin (including scheme/port).
// For local dev, '*' is the safest option.
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
app.use(express.json())


app.get('/', (req, res) => {
  res.json({
    message: 'MERN template API is running',
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    port,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks', tasksRoutes)

// Basic error handler (keeps response consistent)
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  console.error(err)

  const message = err instanceof Error ? err.message : 'Internal Server Error'
  res.status(500).json({ message })
})

async function bootstrap() {
  await dbConnect()

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Failed to start server: ${message}`)
  process.exit(1)
})

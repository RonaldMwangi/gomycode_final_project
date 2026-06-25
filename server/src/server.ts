import cors from 'cors'
import express from 'express'
import { config } from 'dotenv'

import { dbConnect } from './db/db-connect.js'
import { authRoutes, tasksRoutes } from './routes/index.js'

config()

const app = express()
const port = Number(process.env.PORT ?? 5000)

app.use(cors())
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

import { Router } from 'express'

import { requireAuth } from '../middleware/authMiddleware.js'
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/tasks.controller.js'

const router = Router()

router.use(requireAuth)

router.post('/', createTask)
router.get('/', listTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router


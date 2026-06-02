import { Router } from 'express'
import comparisonStatsController from '../controllers/comparisonStats.controller.js'

const router = Router()

router.get('/', comparisonStatsController.getList)

export default router

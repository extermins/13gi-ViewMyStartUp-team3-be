import { Router } from 'express'
import comparesController from '../controllers/compares.controller.js'

const router = Router()

router.get('/', comparesController.getList)
router.get('/:id', comparesController.getOne)
router.post('/:id/compare', comparesController.addCompare)
router.delete('/:id/compare', comparesController.removeCompare)

export default router

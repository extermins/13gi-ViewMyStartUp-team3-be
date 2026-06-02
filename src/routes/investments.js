import { Router } from 'express'
import investmentsController from '../controllers/investments.controller.js'

const router = Router()

router.get('/', investmentsController.getList)
router.post('/', investmentsController.create)
router.put('/:id', investmentsController.update)
router.delete('/:id', investmentsController.remove)

export default router

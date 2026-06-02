import { Router } from 'express'
import startupsController from '../controllers/startups.controller.js'

const router = Router()

router.get('/', startupsController.getList)
router.get('/:id', startupsController.getOne)
router.post('/', startupsController.create)
router.put('/:id', startupsController.update)
router.delete('/:id', startupsController.remove)
router.post('/:id/mypick', startupsController.addMypick)
router.delete('/:id/mypick', startupsController.removeMypick)

export default router

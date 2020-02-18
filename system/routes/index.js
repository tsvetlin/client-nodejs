/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import Router from 'express-promise-router'


const router = Router()

router.all('/', (req, res, next) => {
  res.finalize('Welcome')
})

router.get('/temperature', (req, res, next) => {
  res.finalize(20)
})

export default router

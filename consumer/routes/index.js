/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import Router from 'express-promise-router'

const router = Router()

router.get('/', (req, res, next) => {
  res.finalize('Welcome')
})

export default router

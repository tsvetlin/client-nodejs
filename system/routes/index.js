/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import Router from 'express-promise-router'

//React App Render
import React from 'react';
import { renderToString } from 'react-dom/server'
import ReactApp from '../react'
import template from '../template'

const router = Router()

//router.all('/', (req,))

router.get('/ball', (req, res, next) => {
  res.render('index')
})

router.get('/dashboard', (req, res) => {
  const isMobile = false // assume it's mobile
  const initialState = { isMobile }
  const appString = renderToString(<ReactApp {...initialState} />)

  res.send(template({
    body: appString,
    title: 'Dashboard',
    initialState: JSON.stringify(initialState)
  }))
})

router.post('/demo', (req, res, next) => {
  req.app.io.sockets.emit('balldemo', req.body)
  res.finalize('OK')
})

router.post('/dashboard', (req, res, next) => {
  console.log(req.body)
  req.app.io.sockets.emit('dashboard', req.body.data)
  res.finalize('OK')
})

export default router

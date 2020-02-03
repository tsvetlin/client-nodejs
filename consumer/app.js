/**
 * @author Svetlin Tanyi <szvetlin@aitia.ai> on 2020. 01. 29.
 */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import consumerRouter from './routes'
import os from 'os'
import { config } from './config/config'
import Boom from 'boom'
import logger from 'morgan'
import { responseMiddleware } from './middlewares/responseMiddleware'
import { errorMiddleware } from './middlewares/errorMiddleware'
import { echo, orchestration } from './services/arrowhead/orchestrator'

export const app = express()

export async function initExpress () {

  if (config.env !== 'test' && config.env !== 'production') {
    app.use(logger('dev'))
  }
  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }))
  app.use(responseMiddleware())
  app.use(bodyParser.json({limit: '5mb'}))
  app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}))

  //Add your routes here
  app.use('/', consumerRouter)

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    res.locals.message = err.message
    res.locals.error = config.env === 'development' ? err : {}
    throw Boom.create(404, err)
  })
  app.use(errorMiddleware())
}

export async function start () {
  return initExpress()
    .then(() => {
      return new Promise((resolve) => {
        app.listen(config.port, () => {
          console.log('Consumer started', {env: config.env, port: config.consumerPort})
          return resolve()
        })
      })
    })
    .then(() => orchestration())
    .catch(async (e) => {
      console.log(`Consumer not started on ${os.hostname()}, now exiting.\n`, e)
      process.exit()
    })
}

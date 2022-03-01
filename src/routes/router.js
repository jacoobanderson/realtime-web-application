import express from 'express'
import { router as issueRouter } from './issue-router.js'
import { router as webhookRouter } from './webhook-router.js'

export const router = express.Router()

router.use('/', issueRouter)
router.use('/webhooks', webhookRouter)

router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

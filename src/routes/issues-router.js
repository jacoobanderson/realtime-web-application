import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

router.get('/', (req, res, next) => controller.getIndex(req, res, next))
router.get('/closed', (req, res, next) => controller.getClosedIssues(req, res, next))
router.post('/:id/close', (req, res, next) => controller.closeIssue(req, res, next))
router.post('/:id/reopen', (req, res, next) => controller.reOpenIssue(req, res, next))

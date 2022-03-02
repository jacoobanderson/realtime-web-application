import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

router.get('/', (req, res, next) => controller.getIndex(req, res, next))
router.post('/:id/close', (req, res, next) => controller.closeIssue(req, res, next))
// router.get('/:id/edit', (req, res, next) => controller.edit(req, res, next))

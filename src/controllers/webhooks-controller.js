/**
 *
 */
export class WebhooksController {
  /**
   * @param req
   * @param res
   * @param next
   */
  authenticate (req, res, next) {
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }
    next()
  }

  /**
   * @param req
   * @param res
   * @param next
   */
  hookData (req, res, next) {
    try {
      const data = {
        id: req.body.object_attributes.id,
        iid: req.body.object_attributes.iid,
        title: req.body.object_attributes.title,
        avatar: req.body.user.avatar_url,
        description: req.body.object_attributes.description
      }

      res.status(200).end()

      if (req.body.object_attributes.action === 'open') {
        res.io.emit('openIssue', data)
      } else if (req.body.object_attributes.action === 'close') {
        res.io.emit('closeIssue', data)
      } else if (req.body.object_attributes.action === 'reopen') {
        res.io.emit('reopenIssue', data)
      } else if (req.body.object_attributes.action === 'update') {
        res.io.emit('updateIssue', data)
      }
    } catch (error) {
      next(error)
    }
  }
}

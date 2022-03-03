/**
 * Encapsulates the webhooks controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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
   * Emits socket io events with issue data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
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

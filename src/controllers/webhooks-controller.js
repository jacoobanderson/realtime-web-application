export class WebhooksController {
    authenticate(req, res, next) {
        if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
            const error = new Error('Invalid token')
            error.status = 401
            next(error)
            return
        }
        next()
    }
}